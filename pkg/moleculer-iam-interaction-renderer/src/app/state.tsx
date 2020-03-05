import { ApplicationResponse, ApplicationState } from "moleculer-iam";
import React, { createContext, useContext } from "react";
import { ClientErrorScreen } from "../screen/error";
import { getInitialAppState } from "../../inject";

// read server state and create endpoint request helper
export const AppStateContext = createContext<[ApplicationState, AppStateProvider["dispatch"]]>([] as any);

export function useAppState() {
  return useContext(AppStateContext);
}

export class AppStateProvider extends React.Component<{}> {
  state = {
    error: null as any,
    appState: getInitialAppState(),
  };

  render() {
    const { error, appState } = this.state;

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
  dispatch = async (name: string, userPayload: any = {}): Promise<ApplicationState> => {
    const actions = this.state.appState.actions;
    const action = actions && actions[name];

    if (!action) {
      const err = {global: "Cannot call unsupported action."};
      console.error(err, this.state);
      // eslint-disable-next-line no-throw-literal
      throw err;
    }

    // merge user payload with hint payload
    const {url, urlencoded = false, method, payload} = action;
    const mergedPayload = {...payload, ...userPayload};

    // as application/x-www-form-urlencoded
    if (urlencoded) {
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
      return new Promise<any>(() => {
      });
    }

    // as xhr
    return fetch(action.url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      credentials: "same-origin",
      method,
      body: method !== "GET" ? JSON.stringify(mergedPayload) : undefined,
    })
      .then(res => {
        return res.json()
          .then((data: ApplicationResponse): ApplicationState => {
            if (data.error) { // XHR error response
              // organize field error descriptor for form components on validation error
              if (res.status === 422 && data.error.fields) {
                const err = data.error.fields.reduce((e: any, item: { field: string, message: string, type: string, actual: any }) => {
                  e[item.field] = e[item.field] || item.message;
                  return e;
                }, {});
                console.error(err, data);
                // eslint-disable-next-line no-throw-literal
                throw err;
              } else {
                const err = {global: typeof data.error === "object" ? (data.error.error_description || data.error.error || JSON.stringify(data.error)) : (data.error as any).toString()};
                console.error(err, data);
                // eslint-disable-next-line no-throw-literal
                throw err;
              }

            } else if (data.session) { // got session state update
              const appState = {...this.state.appState, session: data.session!};
              this.setState(prev => ({...prev, app: appState}));
              console.debug("app state updated", appState);
              return appState;

            } else if (data.state) {
              console.error("interaction state response received from XHR", data);

            } else {
              console.error("unrecognized response structure", data);
            }

            return this.state.appState;
          });
      });
  };
}
