import { Client } from "../provider";
import { Identity } from "../../identity";
export declare function getPublicClientProps(client?: Client): Promise<{
    id: any;
    name: any;
    logo_uri: any;
    tos_uri: any;
    policy_uri: any;
    client_uri: any;
} | undefined>;
export declare function getPublicUserProps(id?: Identity): Promise<{
    email: string | undefined;
    name: string;
    picture: string | null;
} | undefined>;
