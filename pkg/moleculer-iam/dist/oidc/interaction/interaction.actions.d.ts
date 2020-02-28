import { InteractionActionEndpoints } from "./interaction.render";
export declare const getStaticInteractionActions: (props: {
    url: (path: string) => string;
    availableFederationProviders: string[];
}) => {
    [interaction: string]: InteractionActionEndpoints;
};
