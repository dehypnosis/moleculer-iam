import { flatten } from "flat";
import { ApplicationResponse, ApplicationState } from "moleculer-iam";
import React, { createContext, useContext } from "react";
import { ClientErrorScreen } from "../screen/error";
import { AppI18NContext, postProcessKoreanJosa } from "./i18n";

// read server state and create endpoint request helper
export const AppStateContext = createContext<[ApplicationState, AppStateProvider["dispatch"]]>([] as any);

export function useAppState() {
  return useContext(AppStateContext);
}

export class AppStateProvider extends React.Component<{initialState: ApplicationState}> {
  static contextType = AppI18NContext;

  state = {
    error: null as any,
    appState: this.props.initialState,
  };

  render() {
    const { error, appState } = this.state;
    console.debug("app state update:", appState);

    // @ts-ignore
    if (window.__APP_DEV__) {
      // @ts-ignore
      window.__APP_DEV__.state = appState;
      // @ts-ignore
      window.__APP_DEV__.dispatch = this.dispatch;
    }

    if (error) {
      return <ClientErrorScreen error={error} />;
    }

    return (
      <AppStateContext.Provider value={[appState, this.dispatch]}>
        {this.props.children}
      </AppStateContext.Provider>
    )
  }

  // wrap with error boundary
  componentDidCatch(error: any, info: any) {
    this.setState(prev => ({ ...prev, error }));
    console.error(error, info);
    // can report uncaught client error here
  }

  // call xhr request and update app state
  dispatch = async (name: string, userPayload: any = {}, payloadLabels: any = {}): Promise<ApplicationState> => {
    const routes = this.state.appState.routes;
    const route = routes && routes[name];

    if (!route) {
      const err = {global: "Cannot make a request to unsupported route."};
      console.error(err, name, userPayload);
      // eslint-disable-next-line no-throw-literal
      throw err;
    }

    // merge user payload with hint payload
    const {url, synchronous = false, method, payload} = route;
    const mergedPayload = {...payload, ...userPayload};

    // form submission required (application/x-www-form-urlencoded)
    if (synchronous) {
      const form = document.createElement("form");
      form.action = url;
      form.method = method;
      form.style.display = "none";
      // tslint:disable-next-line:forin
      for (const k in mergedPayload) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = mergedPayload[k];
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
      return new Promise(() => {}) as any;
    }

    // as xhr
    return fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      credentials: "same-origin",
      method,
      body: method !== "GET" ? JSON.stringify(mergedPayload) : undefined,
    })
      .then(res => {
        // parse json response
        return res.json()
          .then((data: ApplicationResponse): ApplicationState => {
            if (data.error) { // got error response
              const { formatMessage: f, locale } = this.context;
              payloadLabels = flatten(payloadLabels);

              if (res.status === 422 && data.error.data) { // got validation error
                const fields = data.error.data.reduce((obj, entry) => {
                  if (!obj[entry.field]) {
                    // translate error message
                    obj[entry.field] = f({id: `error.${data.error!.error}.data.${entry.type}`, defaultMessage: entry.message }, {
                      ...entry,
                      // eslint-disable-next-line no-mixed-operators
                      expected: (entry.expected && payloadLabels[`${entry.field}.expected`] || entry.type === "equalField" && payloadLabels[entry.expected]) || entry.expected,
                      field: payloadLabels[entry.field] || entry.field,
                    });
                    if (locale.startsWith("ko")) {
                      obj[entry.field] = postProcessKoreanJosa(obj[entry.field]);
                    }
                  }
                  return obj;
                }, {} as {[field: string]: string});
                console.error("validation error", data.error, fields);
                // eslint-disable-next-line no-throw-literal
                throw fields;
              } else {
                const err = {
                  global: (typeof data.error === "object" && typeof data.error.error === "string")
                    ? f({ id: `error.${data.error.error}.description`, defaultMessage: data.error.error_description || data.error.error || JSON.stringify(data.error) })
                    : (data.error as any).toString()
                };
                console.error("global error", err, data);
                // eslint-disable-next-line no-throw-literal
                throw err;
              }

            } else if (data.session) { // got session state update
              const appState = {...this.state.appState, session: data.session!};
              this.setState(prev => ({...prev, appState}));
              return appState;

            } else if (data.state) { // got whole app state update
              const appState = data.state;
              this.setState(prev => ({...prev, appState}));
              console.error("whole application state response received from XHR, this is unexpected behavior but commit update", data);
              return appState;

            } else if (data.redirect) { // got redirection request
              window.location.assign(data.redirect);
              return new Promise(() => {}) as any;

            } else {
              console.error("unrecognized response structure", data);
            }

            return this.state.appState;
          }, err => {
            console.error("failed to parse xhr response", err);
            // eslint-disable-next-line no-throw-literal
            throw {global: err.message || err.name};
          });
      }, err => {
        console.error("failed to get response", err);
        // eslint-disable-next-line no-throw-literal
        throw {global: err.message || err.name};
      });
  };
}
