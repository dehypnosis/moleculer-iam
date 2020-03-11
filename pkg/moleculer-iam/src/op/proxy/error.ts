// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { OIDCError } from "../proxy";

class OIDCProviderProxyError implements OIDCError {
  constructor(
      public readonly status: number,
      public readonly error: string,
      public readonly error_description: string|undefined,
    ) {
  }
}

class InvalidPromptSession extends OIDCProviderProxyError {
  constructor() {
    super(400, "InvalidPromptSession", "The login session has expired or invalid.");
  }
}

class InvalidFederationProvider extends OIDCProviderProxyError {
  constructor() {
    super(400, "InvalidFederationProvider", "Cannot federate account with the invalid provider.");
  }
}

class FederationRequestWithoutEmailPayload extends OIDCProviderProxyError {
  constructor() {
    super(400, "FederationRequestWithoutEmailPayload", "Cannot federate without an email address.");
  }
}

class FederationRequestForDeletedAccount extends OIDCProviderProxyError {
  constructor() {
    super(400, "FederationRequestForDeletedAccount", "Cannot federate a deleted account.");
  }
}

export const OIDCProviderProxyErrors = {
  OIDCProviderProxyError,
  InvalidPromptSession,
  InvalidFederationProvider,
  FederationRequestWithoutEmailPayload,
  FederationRequestForDeletedAccount,
};
