import { ClientMetadata, InteractionResults } from "oidc-provider";
import { Identity } from "../../idp";
import { ProviderConfigBuilder } from "./config";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ApplicationRequestContext, ApplicationSessionState, ApplicationMetadata, ApplicationRoutes } from "./app.types";
import { Client, DeviceInfo, Interaction, Session } from "./proxy.types";
export declare class OIDCProviderContextProxy {
    private readonly ctx;
    private builder;
    private static readonly sessionAppStateField;
    session: Session & {
        state: ApplicationSessionState;
    };
    interaction?: Interaction;
    client?: Client;
    clientMetadata?: Partial<ClientMetadata>;
    user?: Identity;
    userClaims?: Partial<OIDCAccountClaims>;
    device?: DeviceInfo;
    metadata: ApplicationMetadata;
    constructor(ctx: ApplicationRequestContext, builder: ProviderConfigBuilder);
    private get idp();
    private get provider();
    get getURL(): (path: string, withHost?: true | undefined) => string;
    get getNamedURL(): any;
    get routes(): ApplicationRoutes;
    private get sessionAppState();
    setSessionState(update: (prevState: ApplicationSessionState) => ApplicationSessionState): Promise<ApplicationSessionState>;
    private get isXHR();
    render(name: string, error?: OIDCError, additionalRoutes?: ApplicationRoutes): Promise<void>;
    redirectWithUpdate(promptUpdate: Partial<InteractionResults> | {
        error: string;
        error_description?: string;
    }, allowedPromptNames?: string[]): Promise<void>;
    redirect(url: string): void;
    end(): void;
    assertPrompt(allowedPromptNames?: string[]): void;
    getPublicClientProps(client?: Client): Promise<Partial<ClientMetadata> | undefined>;
    getPublicUserProps(id?: Identity): Promise<Partial<OIDCAccountClaims> | undefined>;
    _dangerouslyCreate(): Promise<this>;
    private _parseInteractionState;
}
