import { Client } from "../provider";
import { Identity } from "../../identity";
export declare function getPublicClientProps(client?: Client): Promise<{
    id: string;
    name: string | undefined;
    logo_uri: string | null;
    tos_uri: string | null;
    policy_uri: string | null;
    client_uri: string | undefined;
} | undefined>;
export declare function getPublicUserProps(id?: Identity): Promise<{
    email: string | undefined;
    name: string;
    picture: string | null;
} | undefined>;
