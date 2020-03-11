import { AdapterConstructor } from "oidc-provider";
import { Logger } from "../../../helper/logger";
import { OIDCModelProxy, OIDCModelProxyProps, OIDCModelName } from "./model";
export declare type OIDCAdapterProxyProps = {
    logger: Logger;
};
export declare abstract class OIDCAdapterProxy {
    protected readonly props: OIDCAdapterProxyProps;
    protected readonly models: Map<OIDCModelName, OIDCModelProxy>;
    protected readonly logger: Logger;
    abstract readonly displayName: string;
    readonly adapterConstructorProxy: AdapterConstructor;
    constructor(props: OIDCAdapterProxyProps);
    private initialized;
    protected abstract createModel(props: OIDCModelProxyProps): OIDCModelProxy;
    getModel(name: OIDCModelName): OIDCModelProxy;
    /**
     * Lifecycle methods: do sort of DBMS schema migration and making connection
     */
    start(): Promise<void>;
    stop(): Promise<void>;
}
