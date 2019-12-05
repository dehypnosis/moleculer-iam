import React from "react";
import { OIDCProps } from "../../types";
import { OIDCInteractionPage } from "../page";
import { TextFieldStyles } from "../styles";
import { Link, TextField } from "office-ui-fabric-react";
import { sendRequest } from "../../request";
import { OIDCInteractionStackContext } from "../context";
import { LoginInteractionEnterPassword } from "./password";

export class LoginInteraction extends React.Component<{
  oidc: OIDCProps,
}, {
  loading: boolean,
  email: string,
  errors: { [key: string]: string },
}> {
  public state = {
    loading: false,
    email: this.props.oidc.interaction!.action!.submit.data.email || "",
    errors: {} as { [key: string]: string },
  };

  public static contextType = OIDCInteractionStackContext;

  public render() {
    const {loading, email, errors} = this.state;
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
          },
          {
            text: "Sign up",
            onClick: this.handleSignUp,
          },
        ]}
        error={errors.global}
      >
        <TextField
          label="Email"
          type="text"
          inputMode="email"
          placeholder="Enter your email"
          autoFocus
          value={email}
          errorMessage={errors.email}
          onChange={(e, v) => this.setState({email: v || ""})}
          onKeyUp={e => e.key === "Enter" && !loading && this.handleNext()}
          styles={TextFieldStyles.bold}
        />
        <Link href="/forget-email" variant="small" style={{marginTop: "10px"}}>Forgot email?</Link>
      </OIDCInteractionPage>
    );
  }

  public handleNext = async () => {
    const {loading, email} = this.state;
    if (loading) return;
    this.setState({loading: true, errors: {}}, async () => {
      try {
        const oidc = await sendRequest(this.props.oidc.interaction!.action!.submit, {
          email,
        });
        const { error } = oidc;
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
    // TODO: sign up link
  }
}
