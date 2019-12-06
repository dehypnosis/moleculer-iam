import React from "react";
import { OIDCProps } from "../../types";
import { OIDCInteractionPage } from "../page";
import { request } from "../../request";
import { OIDCInteractionStackContext } from "../context";

export class LogoutInteraction extends React.Component<{
  oidc: OIDCProps,
}, {
  loading: boolean,
  errors: { [key: string]: string },
}> {
  public state = {
    loading: false,
    errors: {} as { [key: string]: string },
  };

  public static contextType = OIDCInteractionStackContext;

  public render() {
    const { loading, errors } = this.state;
    const { user } = this.props.oidc.interaction!.data!;

    return (
      <OIDCInteractionPage
        title={`Sign out`}
        subtitle={user.email}
        buttons={[
          {
            primary: true,
            text: "Confirm",
            onClick: this.handleConfirm,
            loading,
          },
          {
            text: "Cancel",
            onClick: this.handleCancel,
            loading,
            tabIndex: 2,
          },
        ]}
        error={errors.global}
      >
      </OIDCInteractionPage>
    );
  }

  public handleConfirm = async () => {
    const {loading} = this.state;
    if (loading) return;
    this.setState({loading: true, errors: {}}, async () => {
      try {
        await request({
          ...this.props.oidc.interaction!.action!.submit,
        });
      } catch (error) {
        this.setState({errors: {global: error.toString()}, loading: false});
      }
    });
  }

  public handleCancel = () => {
    if (this.state.loading) return;
    window.history.back();
    setTimeout(() => {
      window.close();
      setTimeout(() => {
        this.setState({errors: {global: "Cannot close the window, you can close the browser manually."}});
      }, 1000);
    }, 500);
  }
}
