import React from "react";
import { OIDCProps } from "../../types";
import { OIDCInteractionPage } from "../page";
import { TextFieldStyles } from "../styles";
import { Link, TextField, AnimationStyles } from "office-ui-fabric-react/lib";
import { request } from "../../request";
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
    const { user, client } = this.props.oidc.interaction!.data!;
    return (
      <OIDCInteractionPage
        title={`Hi, ${user.name}`}
        subtitle={user.email}
        buttons={[
          {
            primary: true,
            text: "Login",
            onClick: this.handleLogin,
            loading,
            tabIndex: 2,
          },
          {
            text: "Cancel",
            onClick: this.handleCancel,
            tabIndex: 3,
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
          tabIndex={1}
          value={password}
          errorMessage={errors.password}
          onChange={(e, v) => this.setState({password: v || ""})}
          onKeyUp={e => e.key === "Enter" && !loading && this.handleLogin()}
          styles={TextFieldStyles.bold}
        />
        <Link tabIndex={4} onClick={this.handleResetPassword} variant="small" style={{marginTop: "10px"}}>Forgot password?</Link>
      </OIDCInteractionPage>
    );
  }

  public handleLogin = async () => {
    const {loading, password} = this.state;
    if (loading) return;

    this.setState({loading: true, errors: {}}, async () => {
      try {
        const oidc = await request(this.props.oidc.interaction!.action!.submit, {
          email: this.props.oidc.interaction!.data.user.email,
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

  public handleResetPassword = () => {
    if (this.state.loading) return;
    this.setState({ loading: true }, () => {
      return request(this.props.oidc.interaction!.action!.resetPassword);
    });
  }
}
