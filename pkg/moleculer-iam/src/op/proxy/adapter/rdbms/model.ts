import { AdapterPayload } from "oidc-provider";
import { ModelClass, FindOptions, WhereAttributeHash } from "../../../../lib/rdbms";
import { OIDCModelProxyProps, OIDCModelProxy } from "../model";

// tslint:disable-next-line:class-name
export class OIDCRDBMSModelProxy extends OIDCModelProxy {
  constructor(protected readonly props: OIDCModelProxyProps, private readonly model: ModelClass) {
    super(props);
  }

  public async consume(id: string): Promise<void> {
    await this.model.update({consumedAt: new Date()}, {where: {id}});
  }

  public async destroy(id: string): Promise<void> {
    await this.model.destroy({where: {id}});
  }

  public async find(id: string): Promise<AdapterPayload | undefined> {
    const found: any = await this.model.findByPk(id);
    if (!found) {
      return undefined;
    }
    return this.getEntryData(found);
  }

  public async findByUid(uid: string): Promise<AdapterPayload> {
    const found: any = await this.model.findOne({where: {uid}});
    return this.getEntryData(found);
  }

  public async findByUserCode(userCode: string): Promise<AdapterPayload> {
    const found: any = await this.model.findOne({where: {userCode}});
    return this.getEntryData(found);
  }

  public async get(args: FindOptions = {}): Promise<AdapterPayload[]> {
    if (typeof args.offset === "undefined") args.offset = 0;
    if (typeof args.limit === "undefined") args.limit = 10;
    if (args && args.where) {
      args = { ...args, where: {data: args.where}};
    }
    const founds = await this.model.findAll(args);
    return founds.map(this.getEntryData);
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

  public async upsert(id: string, data: AdapterPayload, expiresIn: number): Promise<void> {
    await this.model.upsert({
      id,
      data,
      ...(data.grantId ? {grantId: data.grantId} : undefined),
      ...(data.userCode ? {userCode: data.userCode} : undefined),
      ...(data.uid ? {uid: data.uid} : undefined),
      ...(expiresIn ? {expiresAt: new Date(Date.now() + (expiresIn * 1000))} : undefined),
    });
  }

  private getEntryData(entry: any): any {
    return {
      ...entry.data,
      ...(typeof entry.consumedAt !== "undefined" ? {consumed: !!entry.consumedAt} : undefined),
    };
  }
}
