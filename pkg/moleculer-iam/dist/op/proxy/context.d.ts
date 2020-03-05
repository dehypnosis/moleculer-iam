import { ClientMetadata, InteractionResults } from "oidc-provider";
import { Identity } from "../../idp";
import { ProviderConfigBuilder } from "./config";
import { OIDCAccountClaims } from "./identity.types";
import { ApplicationRequestContext, ApplicationState, ApplicationSessionState, ApplicationMetadata } from "./app.types";
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
    get getURL(): (path: string) => string;
    get getNamedURL(): any;
    private get sessionAppState();
    setSessionState(update: (prevState: ApplicationSessionState) => ApplicationSessionState): Promise<ApplicationSessionState>;
    private get isXHR();
    render(stateProps: Pick<ApplicationState, "name" | "actions"> | Pick<ApplicationState, "name" | "error">): Promise<void>;
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
