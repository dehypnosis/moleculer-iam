import { Client } from "../provider";
import { Identity } from "../../identity";
export declare function getPublicClientProps(client: Client): Promise<{
    id: string;
    name: string | undefined;
    logo: string | null;
    tos: string | null;
    privacy: string | null;
    homepage: string | undefined;
} | null>;
export declare function getPublicUserProps(id: Identity): Promise<{
    email: string | undefined;
    name: string;
    picture: string | null;
} | null>;
