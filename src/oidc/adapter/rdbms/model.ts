import { ModelClass, FindOptions } from "../../../helper/rdbms";
import { OIDCModel, OIDCModelPayload, OIDCModelProps } from "../model";

function getEntryData(entry: any): any {
  return {
    ...entry.data,
    ...(entry.consumedAt ? {consumed: true} : undefined),
  };
}

// tslint:disable-next-line:class-name
export class OIDC_RDBMS_Model<M extends OIDCModelPayload = OIDCModelPayload> extends OIDCModel<M> {
  constructor(protected readonly props: OIDCModelProps, private readonly model: ModelClass) {
    super(props);
  }

  public async consume(id: string): Promise<void> {
    await this.model.update({consumedAt: new Date()}, {where: {id}});
  }

  public async count(...args: any[]): Promise<number> {
    return this.model.count();
  }

  public async destroy(id: string): Promise<void> {
    await this.model.destroy({where: {id}});
  }

  public async find(id: string): Promise<M | undefined> {
    const found: any = await this.model.findByPk(id);
    if (!found) {
      return undefined;
    }
    return getEntryData(found);
  }

  public async findByUid(uid: string): Promise<M | undefined> {
    const found: any = await this.model.findOne({where: {uid}});
    if (!found) {
      return undefined;
    }
    return getEntryData(found);
  }

  public async findByUserCode(userCode: string): Promise<M | undefined> {
    const found: any = await this.model.findOne({where: {userCode}});
    if (!found) {
      return undefined;
    }
    return getEntryData(found);
  }

  public async get(opts?: FindOptions): Promise<M[]> {
    if (!opts) opts = {};
    if (typeof opts.offset === "undefined") opts.offset = 0;
    if (typeof opts.limit === "undefined") opts.limit = 10;
    const founds = await this.model.findAll(opts);
    return founds.map(getEntryData);
  }

  public async revokeByGrantId(grantId: string): Promise<void> {
    await this.model.destroy({where: {grantId}});
  }

  public async upsert(id: string, data: M, expiresIn: number): Promise<void> {
    await this.model.upsert({
      id,
      data,
      ...(data.grantId ? {grantId: data.grantId} : undefined),
      ...(data.userCode ? {userCode: data.userCode} : undefined),
      ...(data.uid ? {uid: data.uid} : undefined),
      ...(expiresIn ? {expiresAt: new Date(Date.now() + (expiresIn * 1000))} : undefined),
    });
  }
}
