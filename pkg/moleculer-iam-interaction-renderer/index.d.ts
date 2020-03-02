import { InteractionRenderer } from "moleculer-iam";
import { ServerOptions } from "./inject";
declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};
export default class DefaultInteractionRenderer implements InteractionRenderer {
    private readonly options;
    private views?;
    constructor(options?: RecursivePartial<ServerOptions>);
    private loadViews;
    render: InteractionRenderer["render"];
    routes: InteractionRenderer["routes"];
}
export {};
