import * as _ from "lodash";
import { ApplicationRequestContext, ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";

export type IdentityRegisterOptions = {
  allowedScopes?: string[]; // ["email", "profile", "birthdate", "gender", "phone"]
  forbiddenClaims?: string[]; // ["email_verified", "phone_number_verified"]
  phoneVerificationRequired?: boolean, // false
  emailVerificationRequired?: boolean, // false
}

export function buildRegisterRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void {

  const { allowedScopes, forbiddenClaims } = _.defaultsDeep(opts.register || {}, {
    allowedScopes: ["email", "profile", "birthdate", "gender", "phone"],
    forbiddenClaims: ["email_verified", "phone_number_verified"],
    phoneVerificationRequired: false,
    emailVerificationRequired: false,
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

  async function validatePayload(ctx: ApplicationRequestContext) {
    const { scope = [], claims = {}, credentials } = ctx.request.body;
    const payload = {
      scope: filterScopes(scope),
      claims: filterClaims(claims),
      credentials,
    };

    await ctx.idp.validate(payload);
    return payload;
  }

  builder.app.router
    // redirect to initial render page
    .get("/register/:any+", async ctx => {
      return ctx.op.redirect("/register" + (ctx.search || ""));
    })

    // initial render page
    .get("/register", async ctx => {

      // create empty object into register state
      ctx.op.setSessionPublicState(prevState => ({
        register: {},
        ...prevState,
      }));

      return ctx.op.render("register");
    })

    // validate claims and credentials
    .post("/register/validate", async ctx => {
      const register = await validatePayload(ctx);
      ctx.op.setSessionPublicState(prevState => ({
        ...prevState,
        register,
      }));

      return ctx.op.end();
    });
}
