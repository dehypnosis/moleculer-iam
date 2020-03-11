import { TFunction } from 'i18next';
import { Logger } from "./logger";
declare class I18NHelper {
    private readonly fallbackLanguage;
    private logger;
    constructor();
    translate(...args: Parameters<TFunction>): string;
    setLogger(logger: Logger): void;
    readonly supportedLanguages: string[];
}
declare const I18N: I18NHelper;
export { I18N };
