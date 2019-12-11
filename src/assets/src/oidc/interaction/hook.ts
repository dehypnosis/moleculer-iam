import { useCallback, useState } from "react";

export function useWithLoading() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as {global?: any, [key: string]: any});

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

  return {
    withLoading,
    loading,
    setLoading,
    errors,
    setErrors,
  };
}

export function useClose() {
  const [closed, setClosed]  = useState(false);
  const close = useCallback(() => {
    window.close();
    setTimeout(() => {
      setClosed(true);
    }, 1000);
  }, []);

  return {
    closed, setClosed, close,
  };
}
