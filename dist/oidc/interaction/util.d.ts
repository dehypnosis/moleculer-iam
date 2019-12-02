import { Client } from "../provider";
export declare function getPublicClientProps(client?: Client): {
    client_id: string;
    client_name: string | undefined;
    client_uri: string | null;
    scope: string | null;
    logo_uri: string | null;
    tos_uri: string | null;
    policy_uri: string | null;
} | undefined;
