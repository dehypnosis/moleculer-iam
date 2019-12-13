import React, { Component } from "react";
import { OIDCInteractionError, OIDCInteractionData } from "./types";
import { OIDCInteractionContext } from "./context";
import { AnimationStyles } from "../styles";

/* Pages */
import { ErrorInteraction } from "./error";
import { LoginInteraction } from "./login";
import { LogoutInteraction } from "./logout";
import { LogoutEndInteraction } from "./logout/end";
import { ConsentInteraction } from "./consent";
import { ResetPasswordInteraction } from "./login/reset-password-set";

export class OIDCInteraction extends Component<{
  oidc: OIDCInteractionData,
}, {
  stack: any[],
  head: number,
  uid: number,
  animation: any,
}> {
  constructor(props: any) {
    super(props);
    const stack = [] as any[];
    const oidc = this.props.oidc as OIDCInteractionData;
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
          case "reset_password":
            stack.push(<ResetPasswordInteraction oidc={oidc}/>);
            break;
          default:
            const err: OIDCInteractionError = {name: "unimplemented_client", message: `application cannot handle ${interaction!.name} interaction`};
            stack.push(<ErrorInteraction error={err}/>);
        }
      }
    } catch (error) {
      stack.push(<ErrorInteraction error={error}/>);
    }
    this.state = {stack, head: stack.length - 1, uid: 0, animation: AnimationStyles.slideLeftIn40};
  }

  public render() {
    const {stack, head, uid, animation} = this.state;
    return (
      <OIDCInteractionContext.Provider
        value={{
          animation,
          push: this.push.bind(this),
          pop: this.pop.bind(this),
          size: stack.length,
          key: uid,
        }}
      >
        {stack.map((item, index) => (
          <span key={index} style={index === head ? {} : {display: "none"}}>
            {item}
          </span>
        ))}
      </OIDCInteractionContext.Provider>
    );
  }

  public pop(num: number = 1) {
    if (num < 1) return;
    if (this.state.head === 0) {
      window.history.back();
      return;
    }
    this.setState({animation: AnimationStyles.slideRightOut40}, () => {
      setTimeout(() => {
        this.setState({
          animation: AnimationStyles.slideRightIn40,
          uid: this.state.uid + 1,
          head: this.state.head - num,
        });
      }, 40);
    });
  }

  public push(...pages: React.ReactElement[]) {
    if (pages.length === 0) return;
    const { stack, head, uid } = this.state;
    const nextHead = head + pages.length;
    const nextStack = stack.slice(0, nextHead);
    nextStack.push(pages.map(page => React.cloneElement(page, { key:  uid+1 })));

    this.setState({
      animation: AnimationStyles.slideLeftIn40,
      stack: nextStack,
      head: nextHead,
      uid: uid + 1,
    }, () => {
      // add history
      if (typeof window.history.pushState !== "undefined") {
        window.history.pushState({index: nextHead}, window.document.title);
      }
    });
  }

  private handlePopState = (e: PopStateEvent) => {
    e.preventDefault();
    const { stack, head, uid } = this.state;
    const index = e.state ? e.state.index : 0;

    // backward
    if (index <= head) {
      this.pop();
    } else {
      // forward
      if (stack.length > head + 1) {
        this.setState({
          animation: AnimationStyles.slideLeftIn40,
          head: head + 1,
          uid: uid + 1,
        });
      } else {
        // forward state has been lost
      }
    }
  }

  public componentDidMount(): void {
    window.addEventListener("popstate", this.handlePopState);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("popstate", this.handlePopState);
  }
}
