import LRUCache from "lru-cache";
import { AdapterPayload } from "oidc-provider";
import { OIDCModelProxy, OIDCModelProxyProps } from "../model";

const grantKeyFor = (id: string) => `grant:${id}`;
const sessionUidKeyFor = (id: string) => `sessionUid:${id}`;
const userCodeKeyFor = (userCode: string) => `userCode:${userCode}`;

export class OIDCMemoryModelProxy extends OIDCModelProxy {
  constructor(protected readonly props: OIDCModelProxyProps, private readonly storage: LRUCache<string, any>) {
    super(props);
  }

  public async consume(id: string): Promise<void> {
    this.storage.get(id).consumed = Math.floor(Date.now() / 1000);
  }

  public async delete(): Promise<number> {
    const size = this.storage.itemCount;
    this.storage.reset();
    return size;
  }

  public async destroy(id: string): Promise<void> {
    this.storage.del(id);
  }

  public async find(id: string): Promise<AdapterPayload | undefined> {
    return this.storage.get(id);
  }

  public async get(args?: { offset?: number, limit?: number }): Promise<AdapterPayload[]> {
    if (!args) {
      args = {};
    }
    if (typeof args.offset === "undefined") {
      args.offset = 0;
    }
    if (typeof args.limit === "undefined") {
      args.limit = 10;
    }
    return this.storage.values().slice(args.offset, args.limit);
  }

  public async count(args?: any): Promise<number> {
    return this.storage.length;
  }

  public async findByUid(uid: string): Promise<AdapterPayload> {
    const id = this.storage.get(sessionUidKeyFor(uid));
    return this.find(id) as any;
  }

  public async findByUserCode(userCode: string): Promise<AdapterPayload> {
    const id = this.storage.get(userCodeKeyFor(userCode));
    return this.find(id) as any;
  }

  public async revokeByGrantId(grantId: string): Promise<void> {
    return undefined;
  }

  public async upsert(id: string, data: AdapterPayload, expiresIn: number): Promise<void> {
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
