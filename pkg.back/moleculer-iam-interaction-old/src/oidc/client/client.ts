import * as _ from "lodash";
import { createContext, useContext, useLayoutEffect, useState } from "react";
import { User, UserManager, UserManagerSettings, Log } from "oidc-client";
import ArgsType = jest.ArgsType;

export { User };

const defaultChangeLocation = async (url: string) => {
  if (location.href === url) return;
  if (url.startsWith(location.origin) && history.replaceState) {
    history.replaceState(undefined, document.title, url);
  } else {
    location.replace(url);
    await new Promise(() => {
    });
  }
};

export interface IUserContext {
  loading: boolean;
  user: User | undefined;
  signIn: (opts?: { redirectTo?: string, prompt?: "login consent" | "login" | "consent" | "none", login_hint?: string, change_account?: boolean }) => Promise<void>;
  signOut: (opts?: { redirectTo?: string }) => Promise<void>;
  manage: (opts?: { newWindow?: boolean }) => Promise<void>;
}

export const UserContext = createContext({
  loading: false,
  user: undefined,
  signIn: undefined,
  signOut: undefined,
  manage: undefined,
} as any as IUserContext);

export const useUserContext = () => useContext(UserContext);

export const useUserContextFactory = (
  oidc?: Partial<UserManagerSettings>,
  options?: { automaticSignIn?: boolean | ArgsType<IUserContext["signIn"]>[0], changeLocation?: typeof defaultChangeLocation },
) => {
  const [context, setContext] = useState({
    loading: true,
    user: undefined,
    signIn: undefined,
    signOut: undefined,
    manage: undefined,
  } as any as IUserContext);

  useLayoutEffect(() => {
    const {
      automaticSignIn = false,
      changeLocation = defaultChangeLocation,
    } = options || {};

    // ref: https://github.com/IdentityModel/oidc-client-js/wiki
    const client = new UserManager(_.defaultsDeep(oidc || {}, {
      authority: window.location.origin, // should set oidc provider origin from cross site
      client_id: window.location.origin.replace("https://", "").replace("http://", "").replace(":", "-"), // should set valid client id from cross site
      redirect_uri: window.location.origin,
      post_logout_redirect_uri: window.location.origin,
      response_type: "code",
      response_mode: "fragment",
      prompt: "login consent",
      scope: [...new Set(["openid", "offline_access"].concat(oidc && oidc.scope ? oidc.scope.split(" ").filter(s => !!s) : ["profile", "email", "phone"]))].join(" "),
      loadUserInfo: true,
      automaticSilentRenew: true,
      monitorSession: true,
      checkSessionInterval: 1000,
    }));

    // Log.logger = console;

    const signIn = async (opts?: {
      redirectTo?: string,
      prompt?: "login consent" | "login" | "consent" | "none",
      login_hint?: string,
      change_account?: boolean,
    }) => {
      const {redirectTo = location.href, prompt, login_hint, change_account} = opts || {};
      const extraQueryParams = {} as any;
      if (typeof change_account !== "undefined") {
        extraQueryParams.change_account = change_account;
      }
      await client.signinRedirect({
        state: redirectTo,
        useReplaceToNavigate: false,
        prompt,
        login_hint,
        extraQueryParams,
      });
      await new Promise(() => {
      });
    };

    const signOut = async (opts?: {
      redirectTo?: string,
    }) => {
      const {redirectTo = location.href} = opts || {};
      await client.signoutRedirect({state: redirectTo, useReplaceToNavigate: false});
      await new Promise(() => {
      });
    };

    const manage = async (opts?: { newWindow?: boolean }) => {
      const isRemote = location.origin !== client.settings.authority;
      const {newWindow = isRemote} = opts || {};
      const url = client.settings.authority!;
      if (newWindow) {
        window.open(url, "_blank");
      } else {
        if (history.replaceState && !isRemote) {
          history.replaceState(undefined, document.title, url);
        } else {
          location.assign(url);
          await new Promise(() => {
          });
        }
      }
    };

    setContext({loading: true, user: undefined, signIn, signOut, manage});

    // update state on token updated
    client.events.addUserLoaded((user) => {
      setContext(ctx => ({...ctx, user}));
    });

    client.getUser()
      .then(async (user) => {
        // try sign in callback
        if (location.hash && !location.hash.startsWith("#error")) {
          try {
            user = await client.signinRedirectCallback();
            if (user.state) {
              await changeLocation(user.state);
            }
          } catch (err) {
            console.debug("[oidc] signinRedirectCallback:", err);
          }
        } else if (user && user.refresh_token) {
          // renew token
          try {
            user = await client.signinSilent();
          } catch (err) {
            console.debug("[oidc] signinSilent:", err);
          }
        }

        // try automatic sign in
        if (automaticSignIn && !user) {
          await signIn(typeof automaticSignIn !== "boolean" ? automaticSignIn : {});
        } else {
          // try sign out callback
          try {
            const signOutResult = await client.signoutRedirectCallback();
            if (signOutResult.state) {
              await changeLocation(signOutResult.state);
            }
          } catch (err) {
            console.debug("[oidc] signoutRedirectCallback:", err);
          }
        }

        // clear old states
        await client.clearStaleState();

        // set loaded user
        setContext(ctx => ({...ctx, loading: false}));
      });
  }, []);

  return context;
};
