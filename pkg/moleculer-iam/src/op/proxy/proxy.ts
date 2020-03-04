import * as kleur from "kleur";
import * as Application from "koa";
import { pick as pickLanguage } from "accept-language-parser";
import { Configuration, Provider } from "oidc-provider";
import { IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
import { buildDefaultInteractions, InteractionBuildOptions } from "../interaction";
import { OIDCAdapterProxy } from "./adapter";
import { ProviderConfigBuilder, StaticConfiguration } from "./config";

// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";
import { DiscoveryMetadata } from "./proxy.types";

export type OIDCProviderProxyProps = {
  logger: Logger;
  idp: IdentityProvider;
};

export type OIDCProviderProxyOptions = StaticConfiguration & {
  interaction?: InteractionBuildOptions;
};

export type ParsedLocale  = {
  language: string;
  country: string;
}

export class OIDCProviderProxy {
  private readonly logger: Logger;
  private readonly provider: Provider;
  private readonly adapter: OIDCAdapterProxy;

  constructor(private readonly props: OIDCProviderProxyProps, options: OIDCProviderProxyOptions) {
    const {logger, idp } = props;
    this.logger = logger;

    // apply static options and get the provider instance and proxy config which can be set dynamically
    const { interaction, ...staticConfig } = options;
    const builder = new ProviderConfigBuilder({
      logger,
      idp,
    }, staticConfig);

    // build main logic with options
    buildDefaultInteractions(builder, interaction);

    // create provider and adapter
    this.provider = builder._dangerouslyBuild();
    this.adapter = builder.adapter;
  }

  private get hidden() {
    return getProviderHiddenProps(this.provider);
  }

  // http handler application (Koa)
  public get app() {
    return this.provider!.app;
  }

  public get configuration(): Configuration {
    return this.hidden.configuration();
  }

  public get supportedLocales(): string[] {
    return (this.configuration.discovery as DiscoveryMetadata).ui_locales_supported || [];
  }

  public parseLocale(locale: string): ParsedLocale {
    const locales = this.supportedLocales;
    const raw = pickLanguage(locales, locale, { loose: true }) || locales[0] || "ko-KR";
    const [language, country] = raw.split("-");
    const [_, requestCountry] = locale.split("-"); // request locale country will take precedence over matched one
    return { language: language || "ko", country: requestCountry || country || "KR" };
  }

  public get issuer() {
    return this.provider!.issuer;
  }

  public start() {
    return this.adapter.start();
  }

  public stop() {
    return this.adapter.stop();
  }

  // programmable interfaces
  public deleteModels(...args: any[]): any {
  }

  public countModels(...args: any[]): any {
    return 10;
  }

  // set supported claims and scopes (hacky)
  // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/helpers/claims.js#L54
  public syncSupportedClaimsAndScopes(defs: ReadonlyArray<{scope: string, key: string}>) {
    const config = this.configuration;
    const claimsFilter = config.claims as unknown as Map<string, null | { [claim: string]: any }>;
    const claimsSupported = (config as any).claimsSupported as Set<string>;
    defs.forEach(schema => {
      let obj = claimsFilter.get(schema.scope);
      if (obj === null) {
        return;
      }
      if (!obj) {
        obj = {};
        claimsFilter.set(schema.scope, obj);
      }
      obj[schema.key] = null;
      claimsSupported.add(schema.key);
    });

    const scopes = config.scopes as unknown as Set<string>;
    const availableScopes = defs.map(schema => schema.scope).concat(["openid", "offline_access"]);
    for (const s of availableScopes) {
      scopes.add(s);
    }
    for (const s of scopes.values()) {
      if (!availableScopes.includes(s)) {
        scopes.delete(s);
      }
    }

    // log result
    this.logger.info(`available claims for each scopes has been updated:\n${
      [...claimsFilter.entries()]
        .map(([scope, claims]) => {
          return claims
            ? `${kleur.green(scope.padEnd(20))}: ${kleur.white(Object.keys(claims).join(", "))}`
            : `${kleur.green().dim("(token)".padEnd(20))}: ${kleur.dim(scope)}`;
        })
        .join("\n")
    }`);
  }
}
