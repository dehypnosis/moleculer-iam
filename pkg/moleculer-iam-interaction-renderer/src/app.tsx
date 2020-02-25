import React, { useEffect, useRef, useState } from "react";
import { getStateFromPath, NavigationContainer, useLinking } from "@react-navigation/native";
import { Navigator, routeConfig } from "./navigator";
import { useServerState } from "./hook";
import { ClientErrorScreen } from "./screen/error";

const InnerApp: React.FunctionComponent = () => {
  // read state from URI
  const ref = useRef();
  const serverState = useServerState();
  const { getInitialState } = useLinking(ref, {
    prefixes: [window.location.origin],
    config: routeConfig,
    getStateFromPath: (path, options) => {
      const state = getStateFromPath(path, options);
      if (state && state.routes[0]) {
        const route = state.routes[0];
        if (serverState.error) {
          route.name = "error";
          console.error(`serverState.error`, serverState);
        }
        if (serverState.interaction && route.name !== serverState.interaction.name) {
          console.warn(`serverState.interaction differs from matched route`, serverState.interaction, route);
        }
      }
      return state;
    },
  });

  const [loading, setLoading] = useState(true);
  const [initialState, setInitialState] = useState({} as any);
  useEffect(() => {
    (async () => {
      let state;
      try {
        state = await getInitialState();
        setInitialState(state);
        console.debug("initial state loaded from uri", state);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getInitialState]);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      ref={ref}
    >
      <Navigator />
    </NavigationContainer>
  );
};

export class App extends React.Component {
  state = { error: null as any, info: null as any};

  componentDidCatch(error: any, info: any) {
    this.setState({ error, info });
    console.error(error, info);
    // can report uncaught client error here
  }

  render() {
    if (this.state.error) {
      return <ClientErrorScreen {...this.state} />;
    }

    return <InnerApp />;
  }
};
