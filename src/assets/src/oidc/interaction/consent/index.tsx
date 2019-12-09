import React from "react";
import { ThemeStyles, Link, Text, Persona, PersonaSize } from "../../styles";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";

export class ConsentInteraction extends React.Component<{
  oidc: OIDCInteractionProps,
}, {
  loading: boolean,
  errors: { [key: string]: string },
}> {
  public state = {
    loading: false,
    errors: {} as { [key: string]: string },
  };

  public static contextType = OIDCInteractionContext;

  public render() {
    const {loading, errors} = this.state;
    const { client, user, consent } = this.props.oidc.interaction!.data!;

    return (
      <OIDCInteractionPage
        title={<span>Connect to <Text style={{color: ThemeStyles.palette.orange}} variant="xLarge">{client.name}</Text></span>}
        buttons={[
          {
            primary: true,
            text: "Continue",
            onClick: this.handleConfirm,
            loading,
            tabIndex: 1,
          },
          // {
          //   text: "Cancel",
          //   onClick: this.handleReject,
          //   loading,
          //   tabIndex: 2,
          // },
          {
            text: "Use other account",
            onClick: this.handleChangeAccount,
            loading,
            tabIndex: 3,
          },
        ]}
        footer={
          <Text>
            To continue, plco will share your {consent.scopes.new.concat(consent.scopes.accepted).join(", ")} information.
            Before using this application, you can review the <Link href={client.homepage}>{client.name}</Link>'s <Link href={client.privacy} target="_blank" variant="small">privacy policy</Link> and <Link href={client.privacy} target="_blank" variant="small">terms of service</Link>.
          </Text>
        }
        error={errors.global}
      >
        <Persona
          text={user.name}
          secondaryText={user.email}
          size={PersonaSize.size56}
          imageUrl={user.picture}
        />
      </OIDCInteractionPage>
    );
  }

  public handleConfirm = async () => {
    const {loading} = this.state;
    if (loading) return;
    this.setState({loading: true, errors: {}}, async () => {
      try {
        const oidc = await requestOIDCInteraction({
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

  public handleReject = () => {
    const {loading} = this.state;
    if (loading) return;
    this.setState({loading: true, errors: {}}, async () => {
      try {
        const oidc = await requestOIDCInteraction({
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

  public handleChangeAccount = () => {
    const {loading} = this.state;
    if (loading) return;

    requestOIDCInteraction(this.props.oidc.interaction!.action!.changeAccount);
  }
}
