import { vault } from "qmit-sdk";

// create global configuration
// can fetch vault secrets in local/kubernetes environment

/* istanbul ignore next */
export const config = vault.fetch(async (get, list, { appEnv }) => {
  const isDev = appEnv === "dev";
  return {
    env: appEnv,
    isDev,
    isDebug: !!process.env.APP_DEBUG,
    iam: (await get(`${appEnv}/data/iam`)).data,
    issuer: `https://account${isDev ? ".dev" : ""}.qmit.pro`,
    apiGatewayEndpoint: `https://api${isDev ? ".dev" : ""}.qmit.pro`,
  };
});
