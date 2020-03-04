import { InteractionResponse, InteractionState } from "moleculer-iam";
import React, { createContext } from "react";
import { ClientErrorScreen } from "../screen/error";
import { getAppOptions, getInitialAppState } from "../../state";

const { dev } = getAppOptions();

// read server state and create endpoint request helper
export const AppStateContext = createContext<[InteractionState, AppStateContainer["dispatch"]]>([] as any);

export class AppStateContainer extends React.Component {
  state = {
    error: null as any,
    app: getInitialAppState(),
  };

  render() {
    const { error, app } = this.state;

    if (error) {
      return <ClientErrorScreen error={error} />;
    }

    return (
      <AppStateContext.Provider value={[app, this.dispatch]}>
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
  dispatch = async (name: string, userPayload: any = {}): Promise<InteractionState> => {
    const actions = this.state.app.actions;
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
          .then((data: InteractionResponse): InteractionState => {
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
              const newAppState = {...this.state.app, session: data.session!};
              this.setState(prev => ({...prev, app: newAppState}));
              dev && console.debug("app state updated", newAppState);
              return newAppState;

            } else if (data.state) {
              console.error("interaction state response received from XHR", data);

            } else {
              console.error("unrecognized response structure", data);
            }

            return this.state.app;
          });
      });
  };
}
