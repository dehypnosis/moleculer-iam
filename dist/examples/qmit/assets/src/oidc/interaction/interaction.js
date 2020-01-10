"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const context_1 = require("./context");
const styles_1 = require("../styles");
/* Pages */
const error_1 = require("./error");
const login_1 = require("./login");
const logout_1 = require("./logout");
const end_1 = require("./logout/end");
const consent_1 = require("./consent");
const reset_password_set_1 = require("./login/reset-password-set");
class OIDCInteraction extends react_1.Component {
    constructor(props) {
        super(props);
        this.handlePopState = (e) => {
            e.preventDefault();
            const { stack, head, uid } = this.state;
            const index = e.state ? e.state.index : 0;
            // backward
            if (index <= head) {
                this.pop();
            }
            else {
                // forward
                if (stack.length > head + 1) {
                    this.setState({
                        animation: styles_1.AnimationStyles.slideLeftIn40,
                        head: head + 1,
                        uid: uid + 1,
                    });
                }
                else {
                    // forward state has been lost
                }
            }
        };
        const stack = [];
        const oidc = this.props.oidc;
        const { error, interaction } = oidc;
        try {
            if (error) {
                stack.push(<error_1.ErrorInteraction error={error}/>);
            }
            else {
                switch (interaction.name) {
                    case "login":
                        stack.push(<login_1.LoginInteraction oidc={oidc}/>);
                        break;
                    case "consent":
                        stack.push(<consent_1.ConsentInteraction oidc={oidc}/>);
                        break;
                    case "logout":
                        stack.push(<logout_1.LogoutInteraction oidc={oidc}/>);
                        break;
                    case "logout_end":
                        stack.push(<end_1.LogoutEndInteraction oidc={oidc}/>);
                        break;
                    case "reset_password":
                        stack.push(<reset_password_set_1.ResetPasswordInteraction oidc={oidc}/>);
                        break;
                    default:
                        const err = { name: "unimplemented_client", message: `application cannot handle ${interaction.name} interaction` };
                        stack.push(<error_1.ErrorInteraction error={err}/>);
                }
            }
        }
        catch (error) {
            stack.push(<error_1.ErrorInteraction error={error}/>);
        }
        this.state = { stack, head: stack.length - 1, uid: 0, animation: styles_1.AnimationStyles.slideLeftIn40 };
    }
    render() {
        const { stack, head, uid, animation } = this.state;
        return (<context_1.OIDCInteractionContext.Provider value={{
            animation,
            push: this.push.bind(this),
            pop: this.pop.bind(this),
            size: stack.length,
            key: uid,
        }}>
        {stack.map((item, index) => (<span key={index} style={index === head ? {} : { display: "none" }}>
            {item}
          </span>))}
      </context_1.OIDCInteractionContext.Provider>);
    }
    pop(num = 1) {
        if (num < 1)
            return;
        if (this.state.head === 0) {
            window.history.back();
            return;
        }
        this.setState({ animation: styles_1.AnimationStyles.slideRightOut40 }, () => {
            setTimeout(() => {
                this.setState({
                    animation: styles_1.AnimationStyles.slideRightIn40,
                    uid: this.state.uid + 1,
                    head: this.state.head - num,
                });
            }, 40);
        });
    }
    push(...pages) {
        if (pages.length === 0)
            return;
        const { stack, head, uid } = this.state;
        const nextHead = head + pages.length;
        const nextStack = stack.slice(0, nextHead);
        nextStack.push(pages.map(page => react_1.default.cloneElement(page, { key: uid + 1 })));
        this.setState({
            animation: styles_1.AnimationStyles.slideLeftIn40,
            stack: nextStack,
            head: nextHead,
            uid: uid + 1,
        }, () => {
            // add history
            if (typeof window.history.pushState !== "undefined") {
                window.history.pushState({ index: nextHead }, window.document.title);
            }
        });
    }
    componentDidMount() {
        window.addEventListener("popstate", this.handlePopState);
    }
    componentWillUnmount() {
        window.removeEventListener("popstate", this.handlePopState);
    }
}
exports.OIDCInteraction = OIDCInteraction;
//# sourceMappingURL=interaction.js.map