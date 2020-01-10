"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const styles_1 = require("../styles");
const context_1 = require("./context");
const logo_svg_1 = tslib_1.__importDefault(require("../../image/logo.svg"));
exports.OIDCInteractionPage = ({ title, subtitle, children, buttons, error, footer }) => {
    const { animation, key } = react_1.useContext(context_1.OIDCInteractionContext);
    return (<styles_1.Stack horizontalAlign="center" verticalAlign="center" verticalFill styles={{
        root: Object.assign({ minWidth: "360px", maxWidth: "450px", minHeight: "600px", margin: "0 auto", padding: "0 0 80px", color: "#605e5c" }, animation),
    }} key={key}>
      <styles_1.Stack tokens={{ childrenGap: 30 }} styles={{
        root: {
            padding: "30px",
            width: "100%",
            minHeight: "600px",
        },
    }}>
        <styles_1.Stack>
          <styles_1.Image src={logo_svg_1.default} styles={{ root: { height: "47px" } }} shouldFadeIn={false}/>
        </styles_1.Stack>

        <styles_1.Stack tokens={{ childrenGap: 5 }}>
          <styles_1.Text variant="xLargePlus" styles={{ root: { fontWeight: styles_1.FontWeights.regular } }} children={title}/>
          {subtitle ? <styles_1.Text variant="large" children={subtitle}/> : null}
        </styles_1.Stack>

        {children ? <styles_1.Stack styles={{ root: { flex: "5 1 auto" } }} tokens={{ childrenGap: 15 }} children={children}/> : null}

        {(buttons.length > 0 || footer) ? <styles_1.Stack tokens={{ childrenGap: 15 }} verticalAlign="end">
          {error ? <styles_1.MessageBar messageBarType={styles_1.MessageBarType.error} styles={{ root: styles_1.AnimationStyles.slideDownIn20 }} children={error}/> : null}
          {buttons.map(({ primary, text, onClick, autoFocus, loading, tabIndex }, index) => {
        const Button = primary ? styles_1.PrimaryButton : styles_1.DefaultButton;
        return <Button key={index} tabIndex={tabIndex} autoFocus={autoFocus} checked={loading === true} allowDisabledFocus text={text} styles={styles_1.ButtonStyles.large} onClick={onClick}/>;
    })}
          {footer}
        </styles_1.Stack> : null}
      </styles_1.Stack>
    </styles_1.Stack>);
};
//# sourceMappingURL=page.js.map