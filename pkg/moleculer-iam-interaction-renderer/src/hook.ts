import { DependencyList, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigation as useOriginalNavigation, useRoute } from "@react-navigation/native";
import { AppStateContext } from "./app/state";
export { getAppOptions } from "../state";

// get global app state
export function useAppState() {
  return useContext(AppStateContext);
}

// do async job with loading state
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

  const withLoading = <T extends any[]>(callback: (...args: T) => any | Promise<any>, deps: DependencyList = []) => {
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

// enhance navigation instance methods
export function useNavigation() {
  // set undefined params as empty object
  const route = useRoute() as ReturnType<typeof useRoute> & { params: {[key: string]: any} };
  if (!route.params) route.params = {};

  // override nav methods to include locale query for navigation
  const nav = useOriginalNavigation();
  const navigate = nav.navigate;
  nav.navigate = (...args: any[]) => {
    includeLocaleQuery(args, route);
    return navigate(...args as any);
  };

  return { nav, route };
}

function includeLocaleQuery(args: any, route: any) {
  if (route.params.locale) {
    if (!args[1] || !args[1].params || !args[1].params.locale) {
      if (!args[1]) {
        args[1] = {};
      }
      if (!args[1].params) {
        args[1].params = {};
      }
      args[1].params.locale = route.params.locale;
    }
  }
}

// close screen
export function useClose(tryGoBack = true) {
  const [closed, setClosed] = useState(false);
  const { nav } = useNavigation();
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
