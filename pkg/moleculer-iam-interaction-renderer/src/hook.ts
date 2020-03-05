import { DependencyList, useCallback, useEffect, useRef, useState } from "react";
import { useNavigation, useAppState, useAppOptions } from "./app";
export { useNavigation, useAppState, useAppOptions };

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
