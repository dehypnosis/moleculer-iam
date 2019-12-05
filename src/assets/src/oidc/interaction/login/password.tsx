import React from "react";
import { OIDCProps } from "../../types";
import { OIDCInteractionPage } from "../page";
import { TextFieldStyles } from "../styles";
import { Link, TextField, AnimationStyles } from "office-ui-fabric-react/lib";
import { sendRequest } from "../../request";
import { OIDCInteractionStackContext } from "../context";

export class LoginInteractionEnterPassword extends React.Component<{
  oidc: OIDCProps,
}, {
  loading: boolean,
  password: string,
  errors: { [key: string]: string },
}> {
  public state = {
    loading: false,
    password: "",
    errors: {} as { [key: string]: string },
  };

  public static contextType = OIDCInteractionStackContext;

  public render() {
    const {loading, password, errors} = this.state;
    const { email, name } = this.props.oidc.interaction!.data!;
    return (
      <OIDCInteractionPage
        title={`Hi, ${name}`}
        subtitle={email}
        buttons={[
          {
            primary: true,
            text: "Login",
            onClick: this.handleLogin,
            loading,
          },
          {
            text: "Cancel",
            onClick: this.handleCancel,
          },
        ]}
        error={errors.global}
      >
        <TextField
          label="Password"
          type="password"
          inputMode="text"
          placeholder="Enter your password"
          autoFocus
          value={password}
          errorMessage={errors.password}
          onChange={(e, v) => this.setState({password: v || ""})}
          onKeyUp={e => e.key === "Enter" && !loading && this.handleLogin()}
          styles={TextFieldStyles.bold}
        />
        <Link href="/forget-password" variant="small" style={{marginTop: "10px"}}>Forgot password?</Link>
      </OIDCInteractionPage>
    );
  }

  public handleLogin = async () => {
    const {loading, password} = this.state;
    if (loading) return;

    this.setState({loading: true, errors: {}}, async () => {
      try {
        const oidc = await sendRequest(this.props.oidc.interaction!.action!.submit, {
          password,
        });
        const { error, redirect } = oidc;
        if (error) {
          if (error.status === 422) {
            this.setState({errors: error.detail, loading: false});
          } else {
            this.setState({errors: {password: error.message}, loading: false});
          }
        } else if (redirect) {
          window.location.assign(redirect);
        } else {
          console.error("stuck to handle interaction:", oidc);
        }
      } catch (error) {
        this.setState({errors: {global: error.toString()}, loading: false});
      }
    });
  }

  public handleCancel = () => {
    this.context.pop();
  }
}
