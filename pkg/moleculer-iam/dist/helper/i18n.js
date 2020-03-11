"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const i18next_1 = tslib_1.__importDefault(require("i18next"));
const i18n_en_1 = tslib_1.__importStar(require("./i18n.en"));
const i18n_ko_1 = tslib_1.__importStar(require("./i18n.ko"));
class I18NHelper {
    constructor() {
        this.fallbackLanguage = "en";
        this.logger = console;
        const postProcessors = { capitalizeEnglish: i18n_en_1.capitalizeEnglish, processKoreanJosa: i18n_ko_1.processKoreanJosa };
        for (const [name, process] of Object.entries(postProcessors)) {
            i18next_1.default.use({
                type: "postProcessor",
                name,
                process,
            });
        }
        const resources = {
            en: i18n_en_1.default,
            ko: i18n_ko_1.default,
        };
        i18next_1.default.init({
            lng: this.fallbackLanguage,
            fallbackLng: Object.keys(resources),
            debug: false,
            postProcess: ["processKoreanJosa"],
            interpolation: {
                prefix: "[",
                suffix: "]",
            },
            resources,
            saveMissing: true,
            missingKeyHandler: (lngs, namespace, key, res) => {
                this.logger.error("missingKey", { lngs, namespace, key, res });
            },
        });
    }
    translate(...args) {
        return i18next_1.default.t(...args);
    }
    setLogger(logger) {
        this.logger = logger;
    }
    get supportedLanguages() {
        return i18next_1.default.languages.slice();
    }
}
const I18N = new I18NHelper();
exports.I18N = I18N;
//# sourceMappingURL=i18n.js.map