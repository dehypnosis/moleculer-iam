import * as _ from "lodash";
import { InteractionRequestContext, ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./index";
import { InteractionActionEndpointGroups } from "./actions";

export type IdentityRegisterOptions = {
  allowedScopes?: string[];
  forbiddenClaims?: string[];
}

export function buildRegisterRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void {

  const { allowedScopes, forbiddenClaims } = _.defaultsDeep(opts.register || {}, {
    allowedScopes: ["email", "profile", "birthdate", "gender", "phone"],
    forbiddenClaims: ["email_verified", "phone_number_verified"],
  }) as IdentityRegisterOptions;

  function filterClaims(claims: any) {
    const filteredClaims: any = {};
    for (const [k,v] of Object.entries(claims)) {
      if (!forbiddenClaims!.includes(k)) {
        filteredClaims[k] = v;
      }
    }
    return filteredClaims;
  }

  function filterScopes(scopes: string[]) {
    const filteredScopes: string[] = [];
    for (const s of scopes) {
      if (allowedScopes!.includes(s)) {
        filteredScopes.push(s);
      }
    }
    return filteredScopes;
  }

  async function validatePayload(ctx: InteractionRequestContext) {
    const { scope = [], claims = {}, credentials } = ctx.request.body;
    const payload = {
      scope: filterScopes(scope),
      claims: filterClaims(claims),
      credentials,
    };

    await ctx.idp.validate(payload);
    return payload;
  }

  builder.interaction.router
    // redirect to initial render page
    .get("/register/:any+", async ctx => {
      return ctx.op.redirect("/register" + (ctx.search || ""));
    })

    // initial render page
    .get("/register", async ctx => {
      return ctx.op.render({
        name: "register",
        actions: actions.register,
      });
    })

    // validate claims and credentials
    .post("/register/validate", async ctx => {
      const register = await validatePayload(ctx);
      await ctx.op.setSessionState(prevState => ({
        ...prevState,
        register,
      }));

      return ctx.op.end();
    });
}
