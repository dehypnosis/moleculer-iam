import React from "react";
import { OIDCError, OIDCProps } from "../types";
import { OIDCInteractionStackContext } from "./context";
import { AnimationStyles } from "./styles";
import { ErrorInteraction } from "./error";
import { LoginInteraction } from "./login";
import { LogoutInteraction } from "./logout";
import { LogoutEndInteraction } from "./logout/end";
import { ConsentInteraction } from "./consent";

export class OIDCInteractionStack extends React.Component<{
  oidc: OIDCProps,
}, {
  stack: any[],
  animation: any,
  key: number,
}> {
  constructor(props: any) {
    super(props);
    const stack = [] as any[];
    const oidc = this.props.oidc as OIDCProps;
    const {error, interaction} = oidc;

    try {
      if (error) {
        stack.push(<ErrorInteraction error={error}/>);
      } else {
        switch (interaction!.name) {
          case "login":
            stack.push(<LoginInteraction oidc={oidc}/>);
            break;
          case "consent":
            stack.push(<ConsentInteraction oidc={oidc}/>);
            break;
          case "logout":
            stack.push(<LogoutInteraction oidc={oidc}/>);
            break;
          case "logout_end":
            stack.push(<LogoutEndInteraction oidc={oidc}/>);
            break;
          default:
            const err: OIDCError = {name: "unimplemented_client", message: `application cannot handle ${interaction!.name} interaction`};
            stack.push(<ErrorInteraction error={err}/>);
        }
      }
    } catch (error) {
      stack.push(<ErrorInteraction error={error}/>);
    }
    this.state = {stack, animation: AnimationStyles.slideLeftIn40, key: 0};
  }

  public render() {
    const {stack, key, animation} = this.state;
    return (
      <OIDCInteractionStackContext.Provider
        value={{
          push: this.push.bind(this),
          pop: this.pop.bind(this),
          animation,
          key,
          size: stack.length,
        }}
      >
        {stack.map((item, key) => (
          <span key={key} style={key === stack.length - 1 ? {} : {display: "none"}}>
            {item}
          </span>
        ))}
      </OIDCInteractionStackContext.Provider>
    );
  }

  public pop() {
    this.setState({animation: AnimationStyles.slideRightOut40}, () => {
      setTimeout(() => {
        const stack = this.state.stack.slice();
        stack.pop();
        this.setState({animation: AnimationStyles.slideRightIn40, stack, key: this.state.key + 1}, () => {
          // consume forward history
          if (typeof window.history.pushState !== "undefined") {
            window.history.forward();
          }
        });
      }, 40);
    });
  }

  public push(page: any) {
    const stack = this.state.stack.slice();
    stack.push(page);
    this.setState({stack, animation: AnimationStyles.slideLeftIn40, key: this.state.key + 1}, () => {
      // add history
      if (typeof window.history.pushState !== "undefined") {
        window.history.pushState({},  window.document.title);
      }
    });
  }

  private handleHistoryBack = (e: Event) => {
    e.preventDefault();
    if (this.state.stack.length > 1) {
      this.pop();
    }
  }

  public componentDidMount(): void {
    window.addEventListener("popstate", this.handleHistoryBack);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("popstate", this.handleHistoryBack);
  }
}
