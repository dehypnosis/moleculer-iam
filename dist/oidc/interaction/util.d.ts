import { Client } from "../provider";
export declare const getPublicClientProps: (client?: Client | undefined) => {
    client_id: string;
    client_name: string | undefined;
    client_uri: string | undefined;
    scope: string | undefined;
    logo_uri: string | undefined;
    tos_uri: string | undefined;
    policy_uri: string | undefined;
} | undefined;
