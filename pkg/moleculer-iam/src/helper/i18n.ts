import i18next, { TFunction } from 'i18next';
import { Logger } from "./logger";
import en, { capitalizeEnglish } from "./i18n.en";
import ko, { processKoreanJosa } from "./i18n.ko";

class I18NHelper {
  private readonly fallbackLanguage = "en";
  private logger: Logger = console;
  constructor() {
    const postProcessors = { capitalizeEnglish, processKoreanJosa };
    for (const [name, process] of Object.entries(postProcessors)) {
      i18next.use({
        type: "postProcessor",
        name,
        process,
      });
    }

    const resources = {
      en,
      ko,
    };

    i18next.init({
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

  public translate(...args: Parameters<TFunction>) {
    return i18next.t(...args);
  }

  public setLogger(logger: Logger) {
    this.logger = logger;
  }

  public get supportedLanguages() {
    return i18next.languages.slice();
  }
}

const I18N = new I18NHelper();
export { I18N };
