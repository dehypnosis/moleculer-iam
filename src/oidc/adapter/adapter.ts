import { OIDCModelAdapterConstructor, OIDCModelPayload, OIDCModelName, OIDCModelNames } from "../provider";
import { OIDCModel } from "./model";
import { Logger } from "../../logger";
import kleur from "kleur";

export type OIDCAdapterProps = {
  logger?: Logger,
};

export abstract class OIDCAdapter {
  protected readonly models = new Map<OIDCModelName, OIDCModel>();
  protected readonly logger: Logger;
  public readonly originalAdapterProxy: OIDCModelAdapterConstructor;
  public readonly abstract displayName: string;

  protected abstract createModel(name: OIDCModelName): OIDCModel;

  private initialized = false;

  public getModel<T extends OIDCModelPayload = OIDCModelPayload>(name: OIDCModelName): OIDCModel<T> {
    // initialize all models once
    if (!this.initialized) {
      // create all models
      for (const modelName of OIDCModelNames) {
        this.models.set(modelName, this.createModel(modelName));
      }
      this.initialized = true;
    }

    // find model
    const model = this.models.get(name) as OIDCModel<T>;
    if (!model) {
      throw new Error("model not found: adapter did not created the model: " + name);
    }
    return model;
  }

  constructor(protected readonly props: OIDCAdapterProps, options?: any) {
    this.logger = props.logger || console;

    // original oidc-provider create models lazilly but OIDCAdapter create all models before start and get cached models on demand
    const self = this;
    // tslint:disable-next-line:max-classes-per-file
    this.originalAdapterProxy = class OriginalAdapterProxy {
      constructor(name: OIDCModelName) {
        return self.getModel(name);
      }
    } as OIDCModelAdapterConstructor;
  }

  /**
   * Lifecycle methods: do sort of DBMS schema migration and making connection
   */
  public async start(): Promise<void> {
    this.logger.info(`${kleur.blue(this.displayName)} oidc provider adapter has been started`);
  }

  public async stop(): Promise<void> {
    this.logger.info(`${kleur.blue(this.displayName)} oidc provider adapter has been stopped`);
  }
}
