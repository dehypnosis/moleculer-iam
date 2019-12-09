import React from "react";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { TextFieldStyles, ButtonStyles, ThemeStyles, Link, TextField, Stack, PrimaryButton, Separator } from "../../styles";

/* sub pages */
import { LoginInteractionEnterPassword } from "./password";
import { LoginInteractionFindEmail } from "./find-email";
import { withLoading, withLoadingProps } from "../hoc";

@withLoading
class LoginInteraction extends React.Component<{
  oidc: OIDCInteractionProps,
} & withLoadingProps, {
  email: string,
  optionsVisible: boolean,
}> {
  public state = {
    email: this.props.oidc.interaction!.data.user ? this.props.oidc.interaction!.data.user.email : this.props.oidc.interaction!.action!.submit.data.email || "",
    optionsVisible: false,
  };

  public static contextType = OIDCInteractionContext;

  public render() {
    const {loading, errors} = this.props;
    const {email, optionsVisible} = this.state;
    return (
      <OIDCInteractionPage
        title={"Sign in"}
        subtitle={"Use your plco account"}
        buttons={[
          {
            primary: true,
            text: "Next",
            onClick: this.handleNext,
            loading,
            tabIndex: 2,
          },
          {
            text: "Sign up",
            onClick: this.handleSignUp,
            tabIndex: 3,
          },
        ]}
        error={errors.global}
        footer={
          <React.Fragment>
            <Separator><span style={{color: ThemeStyles.palette.neutralTertiary}}>OR</span></Separator>
            {optionsVisible ? (
              <Stack tokens={{childrenGap: 15}}>
                <PrimaryButton checked={loading} styles={ButtonStyles.largeThin} text={"Login with KakaoTalk"} style={{flex: "1 1 auto", backgroundColor: "#ffdc00", color: "black"}} onClick={() => this.handleFederation("kakaotalk")}/>
                <PrimaryButton checked={loading} styles={ButtonStyles.largeThin} text={"Login with Facebook"} style={{flex: "1 1 auto", backgroundColor: "#1876f2", color: "white"}} onClick={() => this.handleFederation("facebook")}/>
              </Stack>
            ) : (
              <Link style={{color: ThemeStyles.palette.neutralTertiary}} onClick={() => this.setState(state => ({optionsVisible: !state.optionsVisible}))}>Find more login options?</Link>
            )}
          </React.Fragment>
        }
      >
        <TextField
          label="Email"
          type="text"
          inputMode="email"
          placeholder="Enter your email"
          autoFocus
          tabIndex={1}
          value={email}
          errorMessage={errors.email}
          onChange={(e, v) => this.setState({email: v || ""})}
          onKeyUp={e => e.key === "Enter" && this.handleNext()}
          styles={TextFieldStyles.bold}
        />
        <Link onClick={this.handleFindEmail} tabIndex={5} variant="small" style={{marginTop: "10px"}}>Forgot email?</Link>
      </OIDCInteractionPage>
    );
  }

  public componentDidMount() {
    if (this.props.oidc.interaction!.data.user) {
      this.context.push(<LoginInteractionEnterPassword oidc={this.props.oidc}/>);
    }
  }

  public handleNext() {
    this.withLoading(async () => {
      const {email} = this.state;
      const oidc = await requestOIDCInteraction(this.props.oidc.interaction!.action!.submit, {
        email,
      });

      const {error} = oidc;
      if (error) {
        if (error.status === 422) {
          this.setState({errors: error.detail});
        } else {
          this.setState({errors: {email: error.message}});
        }
      } else {
        this.context.push(<LoginInteractionEnterPassword oidc={oidc}/>);
      }
    });
  }

  public handleSignUp() {
    this.withLoading(async () => {
      await requestOIDCInteraction(this.props.oidc.interaction!.action!.register);
    });
  }

  public handleFindEmail() {
    this.props.withLoading(async () => {
      this.context.push(<LoginInteractionFindEmail oidc={this.props.oidc}/>);
    });
  }

  public handleFederation(provider: string) {
    this.withLoading(async () => {
      await requestOIDCInteraction(this.props.oidc.interaction!.action!.federate, {provider});
    });
  }
}
