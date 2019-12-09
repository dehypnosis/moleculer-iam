import vault from "vault-sync";

// create global configuration
// can fetch vault secrets in local/kubernetes environment
/* istanbul ignore next */
export const config = vault(async (get, list) => {
  const env = process.env.APP_ENV || "dev";
  const isDev = env === "dev";
  return {
    env,
    isDev,
    isDebug: !!process.env.APP_DEBUG,
    oidc: (await get(`${isDev ? "dev" : "prod"}/data/iam`)).data,
  };
}, {
  uri: "https://vault.internal.qmit.pro",
  method: `k8s/${process.env.APP_K8S_CLUSTER || "dev"}`,
  role: "default",
});
