import { ClientApplicationProps, OIDCErrors } from "../../../oidc";

export type OIDCProps = ClientApplicationProps;

export type OIDCError = Partial<OIDCErrors.OIDCProviderError>;
