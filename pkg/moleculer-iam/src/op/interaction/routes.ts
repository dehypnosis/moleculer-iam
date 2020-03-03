import { InteractionActionEndpoints, ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { IdentityFederationManager } from "./federation";

export type InteractionActionEndpointGroups = { [group: string]: InteractionActionEndpoints };

export const buildInteractionActionEndpoints = (builder: ProviderConfigBuilder, opts: InteractionBuildOptions, federator: IdentityFederationManager): InteractionActionEndpointGroups => {
  // internal actions for [logout], [device_code_verification] are not described here
  const { url } = builder.interaction;

  // [find_email]
  const findEmail: InteractionActionEndpoints = {
    "find_email.check_phone": {
      url: url("/find_email/check_phone"),
      method: "POST",
      payload: {
        phone_number: "",
      },
    },
  };

  // [verify_phone]
  const verifyPhone: InteractionActionEndpoints = {
    "verify_phone.send": {
      url: url("/verify_phone/send"),
      method: "POST",
      payload: {
        phone_number: "",
        register: false,
        login: false,
      },
    },
    "verify_phone.verify": {
      url: url("/verify_phone/verify"),
      method: "POST",
      payload: {
        phone_number: "",
        secret: "",
      },
    },
  };

  // [register]
  const register: InteractionActionEndpoints = {
    ...verifyPhone,
    "register.validate": {
      url: url("/register/validate"),
      method: "POST",
      payload: {
        claims: {
          email: "",
          name: "",
          phone_number: "",
          birthdate: "",
          gender: "",
        },
        credentials: {
          password: "",
          password_confirmation: "",
        },
        scope: ["email", "profile", "phone", "birthdate", "gender"],
      },
    },
  };

  // [login] can go to [find_email, reset_password, register, verify_phone, verify_email]
  // "can go" means that an interaction route can be changed without server request in client-side
  // in the SPAs like "moleculer-iam-interaction-renderer"
  // so add transitionable interaction's action endpoints information for client-side usage
  const login: InteractionActionEndpoints = {
    ...findEmail,
    ...register,
    "login.check_email": {
      url: url("/login/check_email"),
      method: "POST",
      payload: {
        email: "",
      },
    },
    "login.check_password": {
      url: url("/login/check_password"),
      method: "POST",
      payload: {
        email: "",
        password: "",
      },
    },
    "login.abort": {
      url: url(`/abort`),
      method: "POST",
    },
    "login.federate": {
      url: url(`/federate`),
      method: "POST",
      payload: {
        provider: "",
      },
      urlencoded: true,
      providers: federator.providerNames,
    },
  };

  // [consent] can go to [login]
  const consent: InteractionActionEndpoints = {
    ...login,
    "consent.accept": {
      url: url("/consent/accept"),
      method: "POST",
      payload: {
        rejected_scopes: [],
        rejected_claims: [],
      },
    },
    "consent.reject": {
      url: url(`/abort`),
      method: "POST",
    },
    "consent.change_account": {
      url: url("/login"),
      method: "GET",
      payload: {
        change_account: "true",
      },
      urlencoded: true,
    },
  };

  return {
    findEmail,
    verifyPhone,
    register,
    login,
    consent,
  };
};
