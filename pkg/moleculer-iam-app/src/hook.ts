import { DependencyList, useCallback, useEffect, useRef, useState } from "react";
import { useNavigation, useAppState, useAppOptions, useAppI18N, languages } from "./app";
export { useNavigation, useAppState, useAppOptions, useAppI18N, languages };

// do async job with loading state
export function useWithLoading() {
  const [loading, setLoading] = useState(false as boolean);
  const [errors, setErrors] = useState({} as { global?: any, [key: string]: any });

  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const withLoading = <T extends any[]>(callback: (...args: T) => any, deps: DependencyList = []) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [callbackLoading, setCallbackLoading] = useState(false as boolean);
    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
    const callWithLoading = useCallback((...args: T) => {
      if (loading) return;
      setLoading(true);
      setCallbackLoading(true);
      setTimeout(async () => {
        try {
          await callback(...args);
        } catch (error) {
          console.error("global error from withLoading callback", error);
          setErrors({global: error.message || error.toString()});
        } finally {
          if (!unmounted.current) {
            setLoading(false);
            setCallbackLoading(false);
          }
        }
      }, 50);
    },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [callback, ...deps]);
    return [callWithLoading, callbackLoading] as [typeof callWithLoading, boolean];
  };

  return {
    withLoading,
    loading,
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
