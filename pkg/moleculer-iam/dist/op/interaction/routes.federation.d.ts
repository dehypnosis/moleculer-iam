import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { IdentityFederationManager } from "./federation";
import { InteractionActionEndpointGroups } from "./routes";
export declare function buildFederationRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups, federation: IdentityFederationManager): void;
