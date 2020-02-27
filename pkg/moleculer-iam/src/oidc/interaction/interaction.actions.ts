import { InteractionActionEndpoints } from "./interaction.render";

export const getStaticInteractionActions = (props: {
  url: (path: string) => string;
  availableFederationProviders: string[];
}): {
  [interaction: string]: InteractionActionEndpoints;
} => {
  // internal actions for [logout], [device_code_verification] are not described here

  const {url, availableFederationProviders} = props;

  // [login] can go to [find_email, reset_password, register, verify_phone, verify_email]
  const login: InteractionActionEndpoints = {
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
      providers: availableFederationProviders,
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
    login,
    consent,
  };
};
