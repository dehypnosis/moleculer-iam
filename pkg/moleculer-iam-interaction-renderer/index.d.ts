import { InteractionRendererAdapter } from "moleculer-iam";
import { ServerOptions } from "./server-state";
declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};
export default class DefaultInteractionRendererAdapter implements InteractionRendererAdapter {
    private readonly options;
    private views?;
    constructor(options?: RecursivePartial<ServerOptions>);
    private loadViews;
    render: InteractionRendererAdapter["render"];
    routes: InteractionRendererAdapter["routes"];
}
export {};
