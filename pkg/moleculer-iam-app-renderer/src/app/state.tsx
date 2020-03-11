import { ApplicationResponse, ApplicationState } from "moleculer-iam";
import React, { createContext, useContext } from "react";
import { ClientErrorScreen } from "../screen/error";
import { getInitialAppState } from "../../client";
import { AppOptionsContext } from "./options";

// read server state and create endpoint request helper
export const AppStateContext = createContext<[ApplicationState, AppStateProvider["dispatch"]]>([] as any);

export function useAppState() {
  return useContext(AppStateContext);
}

export class AppStateProvider extends React.Component<{}> {
  static contextType = AppOptionsContext;

  state = {
    error: null as any,
    appState: getInitialAppState(),
  };

  render() {
    const { error, appState } = this.state;
    console.debug("app state update:", appState);

    // expose dev helper
    const [appOptions, setAppOptions] = this.context;
    if (appOptions.dev) {
      // @ts-ignore
      window.__APP_DEV__ = {
        options: appOptions,
        setOptions: setAppOptions,
        state: appState,
        dispatch: this.dispatch,
      };
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
    const localeQuery = (window.location.search.substr(1).split("&").find(s => s.startsWith("locale=")) || "").split("=")[1];
    const urlWithLocale = localeQuery ? `${url}?locale=` + localeQuery : url;
    const mergedPayload = {...payload, ...userPayload};

    // form submission required (application/x-www-form-urlencoded)
    if (synchronous) {
      const form = document.createElement("form");
      form.action = urlWithLocale;
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
    return fetch(urlWithLocale, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Payload-Labels": Buffer.from(JSON.stringify(payloadLabels), "utf8").toString("base64"),
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
              if (res.status === 422 && data.error.data) { // got validation error
                const fields = data.error.data.reduce((obj, entry) => {
                  obj[entry.field] = obj[entry.field] || entry.message;
                  return obj;
                }, {} as {[field: string]: string});
                console.error("validation error", data.error, fields);
                // eslint-disable-next-line no-throw-literal
                throw fields;
              } else {
                const err = {global: typeof data.error === "object" ? (data.error.error_description || data.error.error || JSON.stringify(data.error)) : (data.error as any).toString()};
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
