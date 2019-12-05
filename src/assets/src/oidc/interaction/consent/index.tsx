import React from "react";
import { OIDCProps } from "../../types";
import { OIDCInteractionPage } from "../page";
import { TextFieldStyles } from "../styles";
import { Link, TextField } from "office-ui-fabric-react";
import { sendRequest } from "../../request";
import { OIDCInteractionStackContext } from "../context";

export class ConsentInteraction extends React.Component<{
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
    const {loading, errors} = this.state;
    const { client, name, email } = this.props.oidc.interaction!.data!;

    return (
      <OIDCInteractionPage
        title={`Connect to ${client.name}`}
        subtitle={email}
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
          },
        ]}
        error={errors.global}
      >
        <div style={{marginTop: "10px"}}>
          <Link href={client.tos} target="_blank" variant="small">Terms</Link> <Link>&amp;</Link> <Link href={client.privacy} target="_blank" variant="small">Privacy</Link>, <Link href={client.homepage} target="_blank" variant="small">Homepage</Link>
        </div>
      </OIDCInteractionPage>
    );
  }

  public handleConfirm = async () => {
    const {loading} = this.state;
    if (loading) return;
    this.setState({loading: true, errors: {}}, async () => {
      try {
        const oidc = await sendRequest({
          ...this.props.oidc.interaction!.action!.submit,
        });
        const { error, redirect } = oidc;
        if (error) {
          if (error.status === 422) {
            this.setState({errors: error.detail, loading: false});
          } else {
            this.setState({errors: {global: error.message}, loading: false});
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
    const {loading} = this.state;
    if (loading) return;
    this.setState({loading: true, errors: {}}, async () => {
      try {
        const oidc = await sendRequest({
          ...this.props.oidc.interaction!.action!.abort,
        });
        const { error, redirect } = oidc;
        if (error) {
          this.setState({errors: {global: error.message}, loading: false});
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
}
