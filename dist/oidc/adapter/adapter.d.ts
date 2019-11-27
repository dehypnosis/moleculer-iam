import { OIDCModelAdapterConstructor, OIDCModelPayload, OIDCModelName } from "../base";
import { OIDCModel } from "./model";
import { Logger } from "../../logger";
export declare type OIDCAdapterProps = {
    logger?: Logger;
};
export declare abstract class OIDCAdapter {
    protected readonly props: OIDCAdapterProps;
    protected readonly models: Map<OIDCModelName, OIDCModel<OIDCModelPayload>>;
    protected readonly logger: Logger;
    readonly originalAdapterProxy: OIDCModelAdapterConstructor;
    protected abstract createModel(name: OIDCModelName): OIDCModel;
    private initialized;
    getModel<T extends OIDCModelPayload = OIDCModelPayload>(name: OIDCModelName): OIDCModel<T>;
    constructor(props: OIDCAdapterProps, options?: any);
    /**
     * Lifecycle methods: do sort of DBMS schema migration and making connection
     */
    start(): Promise<void>;
    stop(): Promise<void>;
}
