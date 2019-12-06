import React from "react";
import { OIDCProps } from "../../types";
import { OIDCInteractionPage } from "../page";
import { TextFieldStyles, ButtonStyles, ThemeStyles } from "../styles";
import { Link, Text, TextField, Stack, PrimaryButton, Separator, IRawStyle } from "office-ui-fabric-react/lib";
import { request } from "../../request";
import { OIDCInteractionStackContext } from "../context";
import { LoginInteractionEnterPassword } from "./password";
import { LoginInteractionFindEmail } from "./find-email";

const federationButtonStyles = {...ButtonStyles.large, label: {fontWeight: 500}} as any;

export class LoginInteraction extends React.Component<{
  oidc: OIDCProps,
}, {
  loading: boolean,
  email: string,
  errors: { [key: string]: string },
  showSocial: boolean,
}> {
  public state = {
    loading: false,
    email: this.props.oidc.interaction!.data.user ? this.props.oidc.interaction!.data.user.email : this.props.oidc.interaction!.action!.submit.data.email || "",
    errors: {} as { [key: string]: string },
    showSocial: false,
  };

  public static contextType = OIDCInteractionStackContext;

  public render() {
    const {loading, email, errors, showSocial} = this.state;
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
            {showSocial ? (
              <Stack tokens={{childrenGap: 15}}>
                <PrimaryButton checked={loading} styles={federationButtonStyles} text={"Login with KakaoTalk"} style={{flex: "1 1 auto", backgroundColor:"#ffdc00", color:"black"}} onClick={() => this.handleFederation("kakaotalk")} />
                <PrimaryButton checked={loading} styles={federationButtonStyles} text={"Login with Facebook"} style={{flex: "1 1 auto", backgroundColor:"#1876f2", color:"white"}} onClick={() => this.handleFederation("facebook")} />
              </Stack>
            ) : (
              <Link style={{color: ThemeStyles.palette.neutralTertiary}} onClick={() => this.setState(state => ({ showSocial: !state.showSocial}))}>Find more login options?</Link>
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
          onKeyUp={e => e.key === "Enter" && !loading && this.handleNext()}
          styles={TextFieldStyles.bold}
        />
        <Link onClick={this.handleFindEmail} tabIndex={5} variant="small" style={{marginTop: "10px"}}>Forgot email?</Link>
      </OIDCInteractionPage>
    );
  }

  public componentDidMount() {
    if (this.props.oidc.interaction!.data.user) {
      this.context.push(<LoginInteractionEnterPassword oidc={this.props.oidc }/>);
    }
  }

  public handleNext = async () => {
    const {loading, email} = this.state;
    if (loading) return;
    this.setState({loading: true, errors: {}}, async () => {
      try {
        const oidc = await request(this.props.oidc.interaction!.action!.submit, {
          email,
        });
        const {error} = oidc;
        if (error) {
          if (error.status === 422) {
            this.setState({errors: error.detail, loading: false});
          } else {
            this.setState({errors: {email: error.message}, loading: false});
          }
        } else {
          this.setState({loading: false}, () => {
            this.context.push(<LoginInteractionEnterPassword oidc={oidc}/>);
          });
        }
      } catch (error) {
        this.setState({errors: {global: error.toString()}, loading: false});
      }
    });
  }

  public handleSignUp = () => {
    if (this.state.loading) return;
    this.setState({ loading: true }, () => {
      return request(this.props.oidc.interaction!.action!.register);
    });
  }

  public handleFindEmail = () => {
    if (this.state.loading) return;
    this.setState({ loading: true }, () => {
      this.context.push(<LoginInteractionFindEmail oidc={this.props.oidc}/>);
    });
  }

  public handleFederation = (provider: string) => {
    if (this.state.loading) return;
    this.setState({ loading: true }, () => {
      return request(this.props.oidc.interaction!.action!.federate, { provider });
    });
  }
}
