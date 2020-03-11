import { ApplicationRendererFactory } from "moleculer-iam";
import { ApplicationOptions } from "./common";
declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};
declare const _default: ApplicationRendererFactory<RecursivePartial<ApplicationOptions>>;
export = _default;
