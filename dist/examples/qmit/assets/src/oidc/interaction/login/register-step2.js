"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const index_1 = require("../index");
const styles_1 = require("../../styles");
const moment_1 = tslib_1.__importDefault(require("moment"));
/* sub pages */
const hook_1 = require("../hook");
const verify_phone_number_1 = require("./verify-phone-number");
const register_complete_1 = require("./register-complete");
exports.LoginInteractionRegisterStep2 = ({ oidc }) => {
    // states
    const context = index_1.useOIDCInteractionContext();
    const [payload, setPayload] = react_1.useState(() => ({
        phone_number: "",
        birthdate: "",
        gender: "",
    }));
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    const handleNext = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield index_1.requestOIDCInteraction(oidc.interaction.action.submit, Object.assign({}, payload));
        const { error, interaction } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ global: error.message });
            }
        }
        else if (interaction && interaction.name === "verify_phone_number") {
            context.push(<verify_phone_number_1.LoginInteractionVerifyPhoneNumber oidc={result}/>);
        }
        else if (interaction && interaction.name === "register") {
            const result2 = yield index_1.requestOIDCInteraction(interaction.action.submit);
            if (result2.error) {
                setErrors({ global: result2.error.message });
            }
            else {
                context.push(<register_complete_1.LoginInteractionRegisterComplete oidc={result2}/>);
            }
        }
        else {
            console.error("stuck to handle interaction:", result);
        }
    }), [payload]);
    const handleCancel = withLoading(() => context.pop(), []);
    // render
    const { email } = oidc.interaction.data;
    return (<index_1.OIDCInteractionPage title={"Welcome to plco"} subtitle={email} buttons={[
        {
            primary: true,
            text: "Next",
            onClick: handleNext,
            loading,
            tabIndex: 3,
        },
        {
            text: "Cancel",
            onClick: handleCancel,
            loading,
            tabIndex: 4,
        },
    ]} error={errors.global}>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleNext();
    }}>
        <styles_1.Stack tokens={{ childrenGap: 15 }}>
          <styles_1.Text>It is highly recommended to enter the mobile phone number to make it easier to find the your lost account.</styles_1.Text>
          <styles_1.TextField label="Phone (optional)" type="text" inputMode="tel" placeholder="Enter your mobile phone number" autoFocus tabIndex={1} value={payload.phone_number} errorMessage={errors.phone_number} onChange={(e, v) => setPayload(p => (Object.assign(Object.assign({}, p), { phone_number: v })))} onKeyUp={e => e.key === "Enter" && handleNext()} styles={styles_1.TextFieldStyles.bold}/>

          <styles_1.DatePicker label="Birthdate" placeholder="Select your birthdate" tabIndex={2} allowTextInput value={payload.birthdate ? moment_1.default(payload.birthdate, "YYYY-MM-DD").toDate() : undefined} onSelectDate={(date) => date && setPayload(p => (Object.assign(Object.assign({}, p), { birthdate: moment_1.default(date).format("YYYY-MM-DD") })))} onKeyUp={e => e.key === "Enter" && handleNext()} formatDate={date => date ? moment_1.default(date).format("YYYY-MM-DD") : ""} initialPickerDate={moment_1.default().subtract(20, "y").toDate()} highlightCurrentMonth highlightSelectedMonth showGoToToday={false} parseDateFromString={str => {
        const d = moment_1.default(str, "YYYY-MM-DD");
        return d.isValid() ? d.toDate() : null;
    }} styles={styles_1.DatePickerStyles.bold}/>
          {errors.birthdate ? <styles_1.Label styles={styles_1.LabelStyles.fieldErrorMessage}>{errors.birthdate}</styles_1.Label> : null}

          <styles_1.Dropdown label="Gender" selectedKey={payload.gender || undefined} onChange={(e, v) => v && setPayload(p => (Object.assign(Object.assign({}, p), { gender: v.key })))} placeholder="Select your gender" options={[
        { key: "male", text: "Male" },
        { key: "female", text: "Female" },
        { key: "other", text: "Other" },
    ]} errorMessage={errors.gender} styles={styles_1.DropdownStyles.bold}/>
        </styles_1.Stack>
      </form>
    </index_1.OIDCInteractionPage>);
};
//# sourceMappingURL=register-step2.js.map