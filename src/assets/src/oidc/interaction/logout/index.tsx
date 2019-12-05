import React from "react";
import { OIDCProps } from "../../types";
import { OIDCInteractionPage } from "../page";
import { sendRequest } from "../../request";
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
    const { email } = this.props.oidc.interaction!.data!;

    return (
      <OIDCInteractionPage
        title={`Sign out`}
        subtitle={email}
        buttons={[
          {
            primary: true,
            text: "Confirm",
            onClick: this.handleConfirm,
            loading,
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
        await sendRequest({
          ...this.props.oidc.interaction!.action!.submit,
        }, undefined, true);
      } catch (error) {
        this.setState({errors: {global: error.toString()}, loading: false});
      }
    });
  }
}
