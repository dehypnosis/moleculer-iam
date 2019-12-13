import { DependencyList, useCallback, useState } from "react";

export function useWithLoading() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as { global?: any, [key: string]: any });

  const withLoading = useCallback(async (callback: () => void | Promise<void>) => {
    if (loading) return;
    setLoading(true);
    setErrors({});
    try {
      await callback();
    } catch (error) {
      console.error(error);
      setErrors({global: error.toString()});
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // @ts-ignore
  function wrapWithLoading<T = any>(callback: (...args: T) => void | Promise<void>, deps: DependencyList) {
    // @ts-ignore
    return useCallback((...args: T) => withLoading(() => callback(args)), deps.concat(withLoading));
  }

  return {
    withLoading: wrapWithLoading,
    loading,
    setLoading,
    errors,
    setErrors,
  };
}

export function useClose(opts?: { tryBack: boolean }) {
  const {tryBack = false} = opts || {};
  const [closed, setClosed] = useState(false);
  const close = useCallback(() => {
    if (tryBack) {
      window.history.back();
      setTimeout(() => {
        window.close();
        setTimeout(() => {
          setClosed(true);
        }, 1000);
      }, 500);
    } else {
      window.close();
      setTimeout(() => {
        setClosed(true);
      }, 1000);
    }
  }, []);

  return {
    closed, setClosed, close,
  };
}
