import { InteractionStateRendererFactory } from "moleculer-iam";
import { AppOptions } from "./state";
declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};
declare const _default: InteractionStateRendererFactory<RecursivePartial<AppOptions>>;
export = _default;
