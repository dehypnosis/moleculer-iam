import React, { CSSProperties, useCallback, useRef, useState } from "react";
import { ContextualMenu, ContextualMenuItemType, DefaultButton, DirectionalHint, IContextualMenuItem, IContextualMenuListProps, IRenderFunction, Persona, PersonaPresence, PersonaSize, PrimaryButton, Stack, ThemeStyles } from "../../styles";
import { useUserContext, User, IUserContext } from "./client";
import { ButtonStyles } from "../styles";

export const UserContextMenu: React.FunctionComponent<{
  hideManageAccount?: boolean,
  size?: PersonaSize,
  presence?: (user?: User) => PersonaPresence,
  style?: CSSProperties,
  items?: (ctx: IUserContext) => IContextualMenuItem[],
}> = ({
        size = PersonaSize.size32,
        presence = (u) => u ? PersonaPresence.online : PersonaPresence.none,
        items = (u) => ([]),
        style = {display: "inline-block", cursor: "pointer"},
        hideManageAccount = false,
      }) => {
  const ctx = useUserContext();
  const personaImageUrl = ctx.user && ctx.user.profile && ctx.user.profile.picture || undefined;

  const renderMenuList = useCallback(() => (menuListProps?: IContextualMenuListProps, defaultRender?: IRenderFunction<IContextualMenuListProps>) => {
    const {user, signOut, signIn, manage} = ctx;
    return (
      <>
        <Stack
          styles={{
            root: {
              padding: "20px",
              width: "320px",
            },
          }}
          horizontalAlign={"center"}
          verticalAlign={"center"}
        >
          <Persona
            imageUrl={personaImageUrl}
            size={PersonaSize.size100}
            presence={presence(user)}
            text={user ? user.profile.name : undefined}
            secondaryText={user ? user.profile.email : undefined}
            initialsColor={ThemeStyles.palette.themePrimary}
            styles={{
              root: {flexDirection: "column", height: "auto"},
              details: {display: "block", textAlign: "center", paddingTop: "15px", maxWidth: "280px"},
            }}
          />
          {(!user || !hideManageAccount)
            ? (
              <div style={{width: "70%", margin: user ? "15px 0 0" : undefined}}>
                <PrimaryButton
                  styles={ButtonStyles.largeFull}
                  text={user ? "Manage Account" : "Sign in"}
                  onClick={user ? () => manage().then(() => setShowContextualMenu(false)) : () => signIn()}
                />
              </div>
            ) : null
          }
        </Stack>
        <div>
          {defaultRender!(menuListProps!)}
        </div>
        {
          user ? (
            <div style={{margin: "20px"}}>
              <DefaultButton
                styles={ButtonStyles.largeFull}
                text={"Sign out"}
                onClick={() => signOut()}
              />
            </div>
          ) : null
        }
      </>
    );
  }, [ctx, personaImageUrl]);

  const [showContextualMenu, setShowContextualMenu] = useState(false);
  const personaRef = useRef(null);
  return (<>
    <div ref={personaRef} style={style}>
      <Persona
        imageUrl={personaImageUrl}
        size={size}
        initialsColor={ThemeStyles.palette.themePrimary}
        presence={presence(ctx.user)}
        onClick={() => setShowContextualMenu(true)}
      />
    </div>
    <ContextualMenu
      gapSpace={10}
      isBeakVisible={false}
      directionalHint={DirectionalHint.topAutoEdge}
      hidden={!showContextualMenu}
      target={personaRef}
      onItemClick={() => setShowContextualMenu(true)}
      onDismiss={() => setShowContextualMenu(false)}
      onRenderMenuList={renderMenuList()}
      items={[
        {
          key: "divider-1",
          itemType: ContextualMenuItemType.Divider,
        },
        ...items(ctx),
      ]}
    />
  </>);
};
