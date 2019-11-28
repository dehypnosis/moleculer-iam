export declare type ClientApplicationContext = {
    interaction_id?: string;
    account_id?: string;
    client?: {
        client_id: string;
        [key: string]: any;
    };
    prompt: {
        name: string;
        details?: any;
        reasons?: string[];
    };
    params: any;
};
export declare type ClientApplicationProps = {
    context: ClientApplicationContext;
    action?: {
        [key in string]: {
            url: string;
            method: "POST" | "GET" | "DELETE";
            data: any;
        };
    };
    data?: any;
    error?: any;
};
export declare const render: (ctx: import("koa").ParameterizedContext<any, import("koa-router").IRouterParamContext<any, {}>>, props?: ClientApplicationProps) => void;
