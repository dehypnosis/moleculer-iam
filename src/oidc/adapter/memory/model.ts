import LRUCache from "lru-cache";
import { OIDCModel, OIDCModelPayload, OIDCModelProps } from "../model";

const grantKeyFor = (id: string) => `grant:${id}`;
const sessionUidKeyFor = (id: string) => `sessionUid:${id}`;
const userCodeKeyFor = (userCode: string) => `userCode:${userCode}`;

export class OIDCMemoryModel<M extends OIDCModelPayload = OIDCModelPayload> extends OIDCModel<M> {
  constructor(protected readonly props: OIDCModelProps, private readonly storage: LRUCache<string, any>) {
    super(props);
  }

  public async consume(id: string): Promise<void> {
    this.storage.get(id).consumed = Math.floor(Date.now() / 1000);
  }

  public async destroy(id: string): Promise<void> {
    this.storage.del(id);
  }

  public async find(id: string): Promise<M | undefined> {
    return this.storage.get(id);
  }

  public async get(opts?: { offset?: number, limit?: number }): Promise<M[]> {
    if (!opts) {
      opts = {};
    }
    if (typeof opts.offset === "undefined") {
      opts.offset = 0;
    }
    if (typeof opts.limit === "undefined") {
      opts.limit = 10;
    }
    return this.storage.values().slice(opts.offset, opts.limit);
  }

  public async count(): Promise<number> {
    return this.storage.length;
  }

  public async findByUid(uid: string): Promise<M | undefined> {
    const id = this.storage.get(sessionUidKeyFor(uid));
    return this.find(id);
  }

  public async findByUserCode(userCode: string): Promise<M | undefined> {
    const id = this.storage.get(userCodeKeyFor(userCode));
    return this.find(id);
  }

  public async revokeByGrantId(grantId: string): Promise<void> {
    return undefined;
  }

  public async upsert(id: string, data: M, expiresIn: number): Promise<void> {
    const key = id;

    if (this.name as string === "Session") {
      this.storage.set(sessionUidKeyFor(data.uid!), id, expiresIn * 1000);
    }

    const {grantId, userCode} = data;
    if (grantId) {
      const grantKey = grantKeyFor(grantId);
      const grant = this.storage.get(grantKey);
      if (!grant) {
        this.storage.set(grantKey, [key]);
      } else {
        grant.push(key);
      }
    }

    if (userCode) {
      this.storage.set(userCodeKeyFor(userCode), id, expiresIn * 1000);
    }

    this.storage.set(key, data, expiresIn * 1000);
  }
}
