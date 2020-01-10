"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const styles_1 = require("../../styles");
const client_1 = require("./client");
const styles_2 = require("../styles");
exports.UserContextMenu = ({ size = styles_1.PersonaSize.size32, presence = (u) => u ? styles_1.PersonaPresence.online : styles_1.PersonaPresence.none, items = (u) => ([]), style = { display: "inline-block", cursor: "pointer" }, hideManageAccount = false, }) => {
    const ctx = client_1.useUserContext();
    const personaImageUrl = ctx.user && ctx.user.profile && ctx.user.profile.picture || undefined;
    const renderMenuList = react_1.useCallback(() => (menuListProps, defaultRender) => {
        const { user, signOut, signIn, manage } = ctx;
        return (<>
        <styles_1.Stack styles={{
            root: {
                padding: "20px",
                width: "320px",
            },
        }} horizontalAlign={"center"} verticalAlign={"center"}>
          <styles_1.Persona imageUrl={personaImageUrl} size={styles_1.PersonaSize.size100} presence={presence(user)} text={user ? user.profile.name : undefined} secondaryText={user ? user.profile.email : undefined} initialsColor={styles_1.ThemeStyles.palette.themePrimary} styles={{
            root: { flexDirection: "column", height: "auto" },
            details: { display: "block", textAlign: "center", paddingTop: "15px", maxWidth: "280px" },
        }}/>
          {(!user || !hideManageAccount)
            ? (<div style={{ width: "70%", margin: user ? "15px 0 0" : undefined }}>
                <styles_1.PrimaryButton styles={styles_2.ButtonStyles.largeFull} text={user ? "Manage Account" : "Sign in"} onClick={user ? () => manage().then(() => setShowContextualMenu(false)) : () => signIn()}/>
              </div>) : null}
        </styles_1.Stack>
        <div>
          {defaultRender(menuListProps)}
        </div>
        {user ? (<div style={{ margin: "20px" }}>
              <styles_1.DefaultButton styles={styles_2.ButtonStyles.largeFull} text={"Sign out"} onClick={() => signOut()}/>
            </div>) : null}
      </>);
    }, [ctx, personaImageUrl]);
    const [showContextualMenu, setShowContextualMenu] = react_1.useState(false);
    const personaRef = react_1.useRef(null);
    return (<>
    <div ref={personaRef} style={style}>
      <styles_1.Persona imageUrl={personaImageUrl} size={size} initialsColor={styles_1.ThemeStyles.palette.themePrimary} presence={presence(ctx.user)} onClick={() => setShowContextualMenu(true)}/>
    </div>
    <styles_1.ContextualMenu gapSpace={10} isBeakVisible={false} directionalHint={styles_1.DirectionalHint.topAutoEdge} hidden={!showContextualMenu} target={personaRef} onItemClick={() => setShowContextualMenu(true)} onDismiss={() => setShowContextualMenu(false)} onRenderMenuList={renderMenuList()} items={[
        {
            key: "divider-1",
            itemType: styles_1.ContextualMenuItemType.Divider,
        },
        ...items(ctx),
    ]}/>
  </>);
};
//# sourceMappingURL=menu.js.map