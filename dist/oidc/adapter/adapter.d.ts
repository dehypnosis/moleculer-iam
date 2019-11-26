import { OIDCModelPayload, OIDCModelName } from "../base";
import { OIDCModel } from "./model";
import { Logger } from "../../logger";
export declare type OIDCAdapterProps = {
    logger?: Logger;
};
export declare abstract class OIDCAdapter implements OIDCAdapter {
    protected readonly props: OIDCAdapterProps;
    /**
     *
     * Creates an instance of MyAdapter for an oidc-provider model.
     *
     * @constructor
     * @param props
     *
     * @param props.name "AuthorizationCode", "RefreshToken", "ClientCredentials", "Client", "InitialAccessToken",
     * "RegistrationAccessToken", "DeviceCode", "Interaction", "ReplayDetection", or "PushedAuthorizationRequest"
     * @param props.logger
     * @param options
     */
    constructor(props: OIDCAdapterProps, options?: any);
    protected readonly logger: Logger;
    abstract createModel<T extends OIDCModelPayload = OIDCModelPayload>(name: OIDCModelName): OIDCModel<T>;
    /**
     * Lifecycle methods: do sort of DBMS schema migration and making connection
     */
    start(): Promise<void>;
    stop(): Promise<void>;
}
