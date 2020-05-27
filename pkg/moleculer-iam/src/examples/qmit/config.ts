import { vault } from "qmit-sdk";

// create global configuration
// can fetch vault secrets in local/kubernetes environment

/* istanbul ignore next */
export const config = vault.fetch(async (get, list, { appEnv }) => {
  return {
    env: appEnv,
    isDev: appEnv === "dev",
    isDebug: !!process.env.APP_DEBUG,
    iam: (await get(`${appEnv}/data/iam`)).data,
  };
});
