import { ApplicationRoutes, ApplicationRoutesFactory, ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";

export const createApplicationRoutesFactory = (builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): ApplicationRoutesFactory => {
  // internal routes for logout, device_flow, ... are not described here
  const {getURL} = builder.app;

  const commonRoutes: ApplicationRoutes = {
    // register
    "register": {
      url: getURL("/register"),
      method: "GET",
      synchronous: true,
    },
    "register.detail": {
      url: getURL("/register/detail"),
      method: "GET",
      synchronous: true,
    },
    "register.submit": {
      url: getURL("/register/submit"),
      method: "POST",
      payload: {
        register: false, // true for register, false for validation
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

    // reset password
    "reset_password": {
      url: getURL("/reset_password"),
      method: "GET",
      synchronous: true,
    },
    "reset_password.set": {
      url: getURL("/reset_password/set"),
      method: "POST",
      payload: {
        email: "",
        password: "",
        password_confirmation: "",
      },
    },

    // verify email
    "verify_email": {
      url: getURL("/verify_email"),
      method: "GET",
      synchronous: true,
    },
    "verify_email.check_email": {
      url: getURL("/verify_email/check_email"),
      method: "POST",
      payload: {
        email: "",
        registered: false,
      },
    },
    "verify_email.send": {
      url: getURL("/verify_email/send"),
      method: "POST",
      payload: {
        email: "",
      },
    },
    "verify_email.verify": {
      url: getURL("/verify_email/verify"),
      method: "POST",
      payload: {
        email: "",
        secret: "",
        callback: "", // reset_password, register, (verify), ...
      },
    },

    // find email
    "find_email": {
      url: getURL("/find_email"),
      method: "GET",
      synchronous: true,
    },

    // verify phone
    "verify_phone": {
      url: getURL("/verify_phone"),
      method: "GET",
      synchronous: true,
    },
    "verify_phone.check_phone": {
      url: getURL("/verify_phone/check_phone"),
      method: "POST",
      payload: {
        phone_number: "",
        registered: false,
      },
    },
    "verify_phone.send": {
      url: getURL("/verify_phone/send"),
      method: "POST",
      payload: {
        phone_number: "",
      },
    },
    "verify_phone.verify": {
      url: getURL("/verify_phone/verify"),
      method: "POST",
      payload: {
        phone_number: "",
        secret: "",
        callback: "", // find_email, register, (verify), ...
      },
    },
  };

  // available for login/consent prompt only
  const loginOrConsentPromptRoutes: ApplicationRoutes = {
    "login": {
      url: getURL("/login"),
      method: "GET",
      synchronous: true,
      payload: {
        email: "",
      },
    },
    "login.check_email": {
      url: getURL("/login/check_email"),
      method: "POST",
      payload: {
        email: "",
      },
    },
    "login.check_password": {
      url: getURL("/login/check_password"),
      method: "POST",
      payload: {
        email: "",
        password: "",
      },
    },
    "login.abort": {
      url: getURL(`/abort`),
      method: "POST",
    },
    "login.federate": {
      url: getURL(`/federate`),
      method: "POST",
      payload: {
        provider: "",
      },
      synchronous: true,
    },
    "register.login": {
      url: getURL("/register/login"),
      method: "POST",
    },
  };

  // available for consent prompt only
  const consentPromptRoutes: ApplicationRoutes = {
    "consent": {
      url: getURL("/consent"),
      method: "GET",
      synchronous: true,
    },
    "consent.accept": {
      url: getURL("/consent/accept"),
      method: "POST",
      payload: {
        rejected_scopes: [],
        rejected_claims: [],
      },
    },
    "consent.reject": {
      url: getURL(`/abort`),
      method: "POST",
    },
    "consent.change_account": {
      url: getURL("/login"),
      method: "GET",
      payload: {
        change_account: "true",
      },
      synchronous: true,
    },
  };

  return (promptName): ApplicationRoutes => {
    return {
      ...commonRoutes,
      ...(promptName === "consent" ? consentPromptRoutes : {}),
      ...(promptName === "login" || promptName === "consent" ? loginOrConsentPromptRoutes : {}),
    };
  };
};
