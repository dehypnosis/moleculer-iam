import { ClientMetadata, InteractionResults } from "oidc-provider";
import { Identity } from "../../idp";
import { ProviderConfigBuilder } from "./config";
import { OIDCAccountClaims } from "./identity.types";
import { InteractionRequestContext, InteractionState, SessionState, InteractionMetadata } from "./interaction.types";
import { Client, Interaction, Session } from "./proxy.types";
export declare class OIDCProviderContextProxy {
    private readonly ctx;
    private builder;
    session: Session & {
        state: SessionState;
    };
    interaction?: Interaction;
    client?: Client;
    user?: Identity;
    metadata: InteractionMetadata;
    constructor(ctx: InteractionRequestContext, builder: ProviderConfigBuilder);
    private get idp();
    private get provider();
    get getURL(): (path: string) => string;
    get getNamedURL(): any;
    render(stateProps: Partial<InteractionState>): Promise<void>;
    redirectWithUpdate(promptUpdate: Partial<InteractionResults> | {
        error: string;
        error_description?: string;
    }, allowedPromptNames?: string[]): Promise<void>;
    redirect(url: string): void;
    end(): void;
    assertPrompt(allowedPromptNames?: string[]): void;
    setSessionState(update: (prevState: SessionState) => SessionState): Promise<SessionState>;
    getPublicClientProps(client?: Client): Promise<Partial<ClientMetadata> | undefined>;
    getPublicUserProps(id?: Identity): Promise<Partial<OIDCAccountClaims> | undefined>;
    _dangerouslyCreate(): Promise<this>;
    private _parseInteractionState;
}
