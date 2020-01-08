import { ModelClass, FindOptions, WhereAttributeHash } from "../../../helper/rdbms";
import { OIDCModel, OIDCModelPayload, OIDCModelProps } from "../model";

function getEntryData(entry: any): any {
  return {
    ...entry.data,
    ...(typeof entry.consumedAt !== "undefined" ? {consumed: !!entry.consumedAt} : undefined),
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

  public async get(args: FindOptions = {}): Promise<M[]> {
    if (typeof args.offset === "undefined") args.offset = 0;
    if (typeof args.limit === "undefined") args.limit = 10;
    if (args && args.where) {
      args = { ...args, where: {data: args.where}};
    }
    const founds = await this.model.findAll(args);
    return founds.map(getEntryData);
  }

  public async delete(args: FindOptions = {}): Promise<number> {
    if (typeof args.offset === "undefined") args.offset = 0;
    if (typeof args.limit === "undefined") args.limit = 10;
    if (args && args.where) {
      args = { ...args, where: {data: args.where}};
    }
    return this.model.destroy(args);
  }

  public async count(args?: WhereAttributeHash): Promise<number> {
    if (args) {
      args = { where: { data: args } };
    }
    return this.model.count(args);
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
