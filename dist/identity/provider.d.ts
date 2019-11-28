import { FindOptions } from "../helper/rdbms";
import { Logger } from "../logger";
import { Identity } from "./identity";
export declare type IdentityProviderProps = {
    logger?: Logger;
};
export declare type IdentityProviderOptions = {};
export declare class IdentityProvider {
    protected readonly props: IdentityProviderProps;
    private readonly logger;
    constructor(props: IdentityProviderProps, opts?: IdentityProviderOptions);
    private working;
    start(): Promise<void>;
    stop(): Promise<void>;
    find(id: string): Promise<Identity>;
    createRegistrationSession(payload: any): Promise<any>;
    register(payload: any): Promise<Identity>;
    update(payload: any): Promise<Identity>;
    updateCredentials(): Promise<void>;
    remove(id: string, opts?: {
        permanent?: boolean;
    }): Promise<void>;
    get(opts?: FindOptions): Promise<Identity[]>;
    findEmail(): Promise<void>;
    federateOtherProvider(): Promise<void>;
    federateCustomSource(): Promise<void>;
    verifyEmail(): Promise<void>;
    sendEmailVerificationCode(): Promise<void>;
    verifyMobile(): Promise<void>;
    sendMobileVerificationCode(): Promise<void>;
}
