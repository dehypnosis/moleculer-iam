"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const styles_1 = require("../../styles");
const __1 = require("../");
const hook_1 = require("../hook");
exports.ConsentInteraction = ({ oidc }) => {
    // state
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    // props
    const { client, user, consent } = oidc.interaction.data;
    // handlers
    const handleConfirm = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.submit);
        const { error, redirect } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ global: error.message });
            }
        }
        else if (redirect) {
            window.location.replace(redirect);
            yield new Promise(() => {
            });
        }
        else {
            console.error("stuck to handle interaction:", result);
        }
    }), []);
    const handleReject = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.abort);
        const { error, redirect } = oidc;
        if (error) {
            setErrors({ global: error.message });
        }
        else if (redirect) {
            window.location.replace(redirect);
            yield new Promise(() => {
            });
        }
        else {
            console.error("stuck to handle interaction:", result);
        }
    }), []);
    const handleChangeAccount = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield __1.requestOIDCInteraction(oidc.interaction.action.changeAccount);
    }), []);
    return (<__1.OIDCInteractionPage title={<span>Connect to <styles_1.Text style={{ color: styles_1.ThemeStyles.palette.orange }} variant="xLarge">{client.name}</styles_1.Text></span>} buttons={[
        {
            primary: true,
            text: "Continue",
            onClick: handleConfirm,
            loading,
            tabIndex: 1,
            autoFocus: true,
        },
        // {
        //   text: "Cancel",
        //   onClick: handleReject,
        //   loading,
        //   tabIndex: 2,
        // },
        {
            text: "Use other account",
            onClick: handleChangeAccount,
            loading,
            tabIndex: 3,
        },
    ]} footer={<styles_1.Text>
          To continue, plco will share your {consent.scopes.new.concat(consent.scopes.accepted).join(", ")} information.
          Before using this application, you can review the <styles_1.Link href={client.homepage}>{client.name}</styles_1.Link>'s <styles_1.Link href={client.privacy} target="_blank" variant="small">privacy policy</styles_1.Link> and <styles_1.Link href={client.privacy} target="_blank" variant="small">terms
          of service</styles_1.Link>.
        </styles_1.Text>} error={errors.global}>
      <styles_1.Persona text={user.name} secondaryText={user.email} size={styles_1.PersonaSize.size56} imageUrl={user.picture}/>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=index.js.map