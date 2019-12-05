import { Client } from "../provider";
export declare function getPublicClientProps(client: Client): {
    id: string;
    name: string | undefined;
    logo: string | null;
    tos: string | null;
    privacy: string | null;
    homepage: string | undefined;
} | null;
