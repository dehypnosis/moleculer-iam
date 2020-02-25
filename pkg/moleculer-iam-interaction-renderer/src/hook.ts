import { createContext, DependencyList, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

/* do async job with loading state */
export function useWithLoading() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as { global?: any, [key: string]: any });

  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const callWithLoading = useCallback(async (callback: () => void | Promise<void>) => {
    if (loading) return;
    setLoading(true);
    setErrors({});
    try {
      await callback();
    } catch (error) {
      console.error(error);
      setErrors({global: error.toString()});
    } finally {
      setTimeout(() => !unmounted.current && setLoading(false), 500);
    }
  }, [loading]);

  const withLoading = <T extends any[]>(callback: (...args: T) => void | Promise<void>, deps: DependencyList = []) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
    return useCallback((...args: T) => callWithLoading(() => callback(...args)), [callback, ...deps]);
  };

  return {
    withLoading,
    loading,
    setLoading,
    errors,
    setErrors,
  };
}


/* read initial interaction information */
const __EMPTY_SERVER_STATE__ = {
  error: {
    error: "unexpected_error",
    error_description: "unrecognized state received from server",
  },
  metadata: {},
};

export function useServerState() {
  const state = (window as any).__SERVER_STATE__ || __EMPTY_SERVER_STATE__;
  state.request = async (name: string, userPayload: any = {}): Promise<any> => {
    const actions = state.interaction && state.interaction.actions;
    const action: {
      url: string,
      method: string,
      payload?: any,
      urlencoded?: boolean,
    } = actions && actions[name];

    if (action) {
      // merge payload
      const { url, urlencoded = false, method, payload } = action;
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
        return new Promise<any>(() => {});
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
            .then(data => {
              if (data.error) {
                if (res.status === 422 && data.fields) {
                  const err = data.fields.reduce((err: any, item: {field: string, message: string, type: string, actual: any}) => {
                    err[item.field] = err[item.field] || item.message;
                    return err;
                  }, {});
                  console.error(err, state);
                  // eslint-disable-next-line no-throw-literal
                  throw err;
                } else {
                  const err = { global: typeof data === "object" ? (data.error_description || data.error || JSON.stringify(data)) : data.toString() };
                  console.error(err, state);
                  // eslint-disable-next-line no-throw-literal
                  throw err;
                }
              } else if (data.redirect) {
                window.location.assign(data.redirect);
                return new Promise(() => {});
              } else {
                return data;
              }
            });
        }, err => {
          console.error(err, state);
          throw err;
        });
    } else {
      const err = { global: "Cannot call unsupported action." };
      console.error(err, state);
      // eslint-disable-next-line no-throw-literal
      throw err;
    }
  };
  return state;
}

/* manage global interaction state */
const clientState: any = {};
const setClientState = (reducer: (prevState: any) => any | any) => {
  if (typeof reducer === "function") {
    Object.assign(clientState, reducer(clientState));
  } else {
    Object.assign(clientState, reducer);
  }
};
const globalStateContext = createContext({globalState: clientState, setGlobalState: setClientState});
export const useGlobalState = () => useContext(globalStateContext);

/* close screen */
export function useClose(tryGoBack = true) {
  const [closed, setClosed] = useState(false);
  const nav = useNavigation();
  const close = useCallback(() => {
    if (tryGoBack && nav.canGoBack()) {
      nav.goBack();
    } else {
      window.close();
      setTimeout(() => setClosed(true), 500);
    }
  }, [nav, tryGoBack]);

  return {
    closed, setClosed, close,
  };
}
