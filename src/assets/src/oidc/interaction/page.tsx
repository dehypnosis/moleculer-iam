import React, { Component, ReactElement, useContext } from "react";
import { FontWeights, Image, Stack, Text, AnimationStyles, DefaultButton, PrimaryButton, MessageBar, MessageBarType } from "office-ui-fabric-react/lib";
import { ButtonStyles } from "./styles";
import logo from "../../image/logo.svg";
import { OIDCInteractionStackContext } from "./context";

export const OIDCInteractionPage: React.FunctionComponent<{
  title: string | ReactElement,
  subtitle?: string | ReactElement,
  buttons: Array<{
    text: string,
    onClick?: () => void,
    primary?: boolean,
    loading?: boolean,
    tabIndex?: number,
  }>,
  footer?: ReactElement,
  error?: string,
}> = ({title, subtitle, children, buttons, error, footer}) => {
  const { animation, key } = useContext(OIDCInteractionStackContext);

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      styles={{
        root: {
          minWidth: "360px",
          maxWidth: "450px",
          minHeight: "600px",
          margin: "0 auto",
          padding: "0 0 80px",
          color: "#605e5c",
          ...animation,
        },
      }}
      key={key}
    >
      <Stack
        tokens={{childrenGap: 30}}
        styles={{
          root: {
            padding: "30px",
            width: "100%",
            minHeight: "600px",
          },
        }}
      >
        <Stack>
          <Image src={logo} styles={{root: {height: "47px"}}} shouldFadeIn={false}/>
        </Stack>

        <Stack tokens={{childrenGap: 5}}>
          <Text
            variant="xLargePlus"
            styles={{root: {fontWeight: FontWeights.regular}}}
            children={title}
          />
          {subtitle ? <Text variant="large" children={subtitle}/> : null}
        </Stack>

        {children ? <Stack styles={{root: {flex: "5 1 auto"}}} children={children} /> : null}

        {(buttons.length > 0 || footer) ? <Stack tokens={{childrenGap: 15}} verticalAlign="end">
          { error ? <MessageBar messageBarType={MessageBarType.error} styles={{root: AnimationStyles.slideDownIn20}} children={error}/> : null }
          {buttons.map(({ primary, text, onClick, loading, tabIndex }, index) => {
            const Button = primary ? PrimaryButton : DefaultButton;
            return <Button key={index} tabIndex={tabIndex} checked={loading === true} allowDisabledFocus text={text} styles={ButtonStyles.large} onClick={onClick} />;
          })}
          {footer}
        </Stack> : null}
      </Stack>
    </Stack>
  );
};
