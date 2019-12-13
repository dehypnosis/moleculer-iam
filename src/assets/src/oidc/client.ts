import * as _ from "lodash";
import { createContext, useContext, useLayoutEffect, useState } from "react";
import { Log, User, UserManager, UserManagerSettings, OidcClient } from "oidc-client";

const defaultChangeLocation = (url: string) => {
  if (location.href === url) return;
  url.startsWith(location.origin) && history.replaceState ? history.replaceState(undefined, document.title, url) : location.replace(url);
};

export const UserContext = createContext({
  loading: false,
  user: undefined as User | undefined,
  signIn: undefined as unknown as ((opts?: {
    redirectTo?: string,
    prompt?: "login" | "consent" | "none",
  }) => Promise<void>),
  signOut: undefined as unknown as ((opts?: {
    redirectTo?: string,
  }) => Promise<void>),
  client: undefined as unknown as UserManager,
});

export const useUserContext = () => useContext(UserContext);

export const useUserContextFactory = (props?: { oidc?: Partial<UserManagerSettings>, automaticSignIn?: boolean, changeLocation?: typeof defaultChangeLocation }) => {
  const [context, setContext] = useState({
    loading: true,
    user: undefined as User | undefined,
    client: undefined as unknown as UserManager,
    signIn: undefined as any,
    signOut: undefined as any,
  });

  useLayoutEffect(() => {
    const {
      automaticSignIn = false,
      changeLocation = defaultChangeLocation,
      oidc = {},
    } = props || {};

    // ref: https://github.com/IdentityModel/oidc-client-js/wiki
    const client = new UserManager(_.defaultsDeep(oidc, {
      authority: window.location.origin,
      client_id: window.location.origin,
      redirect_uri: `${window.location.origin}`,
      post_logout_redirect_uri: `${window.location.origin}`,
      response_type: "id_token token",
      response_mode: "fragment",
      prompt: "consent",
      scope: ["openid", "profile", "email", "phone", "offline_access"].join(" "),
      loadUserInfo: true,
      automaticSilentRenew: true,
      checkSessionInterval: 1000,
    }));

    // Log.logger = console;

    const signIn = async (opts?: {
      redirectTo?: string,
      prompt?: "login" | "consent" | "none",
    }) => {
      const {redirectTo = location.href} = opts || {};
      await client.signinRedirect({state: redirectTo, useReplaceToNavigate: false});
    };

    const signOut = async (opts?: {
      redirectTo?: string,
    }) => {
      const {redirectTo = location.href} = opts || {};
      await client.signoutRedirect({state: redirectTo, useReplaceToNavigate: false});
    };

    setContext({client, signIn, signOut, loading: true, user: undefined});

    client.getUser()
      .then(async (u) => {
        if (u) {
          setContext(ctx => ({...ctx, user: u, loading: false}));
        } else {
          try {
            if (location.hash) {
              const uu = await client.signinRedirectCallback();
              setContext(ctx => ({...ctx, user: uu,}));
              if (uu.state) {
                changeLocation(uu.state);
              }
            }
          } catch (err) {
            // ...
          } finally {
            if (automaticSignIn) {
              await signIn();
            } else {
              try {
                const uu = await client.signoutRedirectCallback();
                if (uu.state) {
                  changeLocation(uu.state);
                }
              } catch (err) {
                // ...
              }
            }

            setContext(ctx => ({...ctx, loading: false}));
          }
        }
      });
  }, [props]);

  return context;
};
