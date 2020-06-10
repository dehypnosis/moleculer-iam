import * as kleur from "kleur";
import { AdapterConstructor  } from "oidc-provider";
import { Logger } from "../../../lib/logger";
import { OIDCModelProxy, OIDCModelProxyProps, OIDCModelName, OIDCModelNames } from "./model";

export type OIDCAdapterProxyProps = {
  logger: Logger,
};

export abstract class OIDCAdapterProxy {
  protected readonly models = new Map<OIDCModelName, OIDCModelProxy>();
  protected readonly logger: Logger;
  public readonly abstract displayName: string;
  public readonly adapterConstructorProxy: AdapterConstructor;

  constructor(protected readonly props: OIDCAdapterProxyProps) {
    this.logger = props.logger;

    // original oidc-provider create models lazilly but OIDCAdapter create all models before start and get cached models on demand
    const self = this;
    // tslint:disable-next-line:max-classes-per-file
    this.adapterConstructorProxy = class AdapterConstructorProxy {
      constructor(name: OIDCModelName) {
        return self.getModel(name);
      }
    } as AdapterConstructor;
  }

  private initialized = false;

  protected abstract createModel(props: OIDCModelProxyProps): OIDCModelProxy;

  public getModel(name: OIDCModelName): OIDCModelProxy {
    // initialize all models once
    if (!this.initialized) {
      // create all models
      for (const modelName of OIDCModelNames) {
        this.models.set(modelName, this.createModel({
          name: modelName,
          logger: this.logger,
        }));
      }
      this.initialized = true;
    }

    // find model
    const model = this.models.get(name);
    if (!model) {
      throw new Error("model not found: adapter proxy did not created the model: " + name);
    }
    return model;
  }

  /**
   * Lifecycle methods: do sort of DBMS schema migration and making connection
   */
  public async start(): Promise<void> {
    this.logger.info(`${kleur.blue(this.displayName)} oidc provider adapter proxy has been started`);
  }

  public async stop(): Promise<void> {
    this.logger.info(`${kleur.blue(this.displayName)} oidc provider adapter proxy has been stopped`);
  }
}
