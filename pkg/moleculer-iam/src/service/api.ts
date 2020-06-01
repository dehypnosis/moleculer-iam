import fs from "fs";
import path from "path";
import { ServiceBroker, ServiceSchema } from "moleculer";
import { ServiceAPISchema } from "moleculer-api";
import { IdentityProvider } from "../idp";
import { OIDCProvider } from "../op";

// will publish public API only if IAM service is connected to API gateway service.
const api: ServiceAPISchema = {
  branch: "master",
  protocol: {
    REST: {
      basePath: "/iam",
      description: "Issue access token for API gateway on purpose of debugging.",
      routes: [
        {
          path: "/login",
          method: "GET",
          call: {
            action: "iam.$login",
            params: {
              request: "@context.request",
              callback: "@query.callback",
            },
          },
        },
        {
          path: "/login/callback",
          method: "GET",
          call: {
            action: "iam.$loginCallback",
            params: {},
          },
        }
      ],
    },
  },
  policy: {
  },
};

export function createAPIGatewayMixin(gatewayURI: string) {
  const URIs = [
    `${gatewayURI}`,
    `https://localhost:9090`
  ];
  const loginURIs = URIs.map(uri => uri + "/iam/login");
  const loginCallbackURIs = loginURIs.map(uri => uri + "/callback");
  const clientParams = {
    client_id: "api-gateway",
    client_name: "API Gateway",
    client_uri: gatewayURI,
    redirect_uris: loginCallbackURIs,
    skip_consent: true,
  };

  let loginCallbackHTML: string;
  const mxin: Partial<ServiceSchema> = {
    metadata: {
      api,
    },
    async started() {
      // load callback response html
      loginCallbackHTML = fs.readFileSync(path.join(__dirname, "./api.login.callback.html")).toString("utf-8");

      // create/update API gateway client
      try {
        await this.broker.call("iam.client.create", clientParams);
      } catch (err) {
        this.broker.logger.debug(err);
        await this.broker.call("iam.client.update", clientParams);
      }
      this.broker.logger.info(`API Gateway login endpoint for debugging purpose: ${loginURIs.join(", ")}`);
    },
    actions: {
      $report: {
        handler({ params: { table, messages }}) {
          this.broker.logger.info(table);
        },
      },
      $login: {
        params: {
          callback: {
            type: "string",
            optional: true,
          },
        },
        async handler({ params: { request, callback }}) {
          // gather all scopes except offline access scope
          const scopesSet = new Set<string>(await (this.idp as IdentityProvider).claims.getActiveClaimsSchemata().then(schemata => schemata.map(s => s.scope)));
          scopesSet.delete("offline_access");
          const scopes = [...scopesSet];

          // create authorization endpoint
          const redirectURI = request.host && loginCallbackURIs.find(uri => uri.includes(request.host)) || loginCallbackURIs[0];
          const callbackURI = callback || request && request.referer || gatewayURI;
          const nonce = Math.floor(Math.random() * 10000).toString();
          const authURI = `${(this.op as OIDCProvider).issuer}/op/auth?client_id=${clientParams.client_id}&response_type=code%20token&scope=${encodeURIComponent(scopes.join(" "))}&prompt=login&redirect_uri=${encodeURIComponent(redirectURI)}&state=${encodeURIComponent(callbackURI)}&nonce=${nonce}`;
          return {
            $status: 303,
            $headers: {
              "Location": authURI,
            },
          };
        },
      },
      $loginCallback: {
        params: {},
        handler() {
          // handle token and redirection in client-side (#id_token=xxx&acess_token=xxx&state=xxx...)
          return {
            $status: 200,
            $body: loginCallbackHTML,
          };
        },
      },
    },
  };
  return mxin;
}
