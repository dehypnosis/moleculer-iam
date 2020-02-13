import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";

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
      setTimeout(() => setLoading(false), 500);
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

export function useServerState() {
  // @ts-ignore
  return window.__SERVER_STATE__ || {};
}

export function useClose() {
  const [closed, setClosed] = useState(false);
  const nav = useNavigation();
  const close = useCallback(() => {
    if (nav.canGoBack()) {
      nav.goBack();
    } else {
      window.close();
      setTimeout(() => {
        setClosed(true);
      }, 1000);
    }
  }, [nav, setClosed]);

  return {
    closed, setClosed, close,
  };
}
