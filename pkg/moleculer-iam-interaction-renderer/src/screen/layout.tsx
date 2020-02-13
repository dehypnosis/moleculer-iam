import React, { ReactElement } from "react";
import { ScrollView } from "react-native";
import { FontWeights, Image, Stack, Text, AnimationStyles, ButtonStyles, DefaultButton, PrimaryButton, MessageBar, MessageBarType } from "../styles";
import logo from "../image/logo.svg";

export const ScreenLayout: React.FunctionComponent<{
  title: string | ReactElement,
  subtitle?: string | ReactElement,
  buttons: {
    text: string,
    autoFocus?: boolean,
    onClick?: () => void,
    primary?: boolean,
    loading?: boolean,
    tabIndex?: number,
  }[],
  footer?: ReactElement,
  error?: string,
}> = (props) => {
  const {title, subtitle, children, buttons, error, footer} = props;

  return (
    <ScrollView contentContainerStyle={{marginTop: "auto", marginBottom: "auto"}}>
        <Stack
          horizontalAlign="stretch"
          verticalAlign="center"
          verticalFill
          styles={{
            root: {
              width: "100%",
              padding: "30px",
            },
          }}
          tokens={{childrenGap: 30}}
        >
          <Image src={logo} styles={{root: {height: "47px"}}} shouldFadeIn={false}/>

          <Stack tokens={{childrenGap: 5}}>
            <Text
              variant="xLargePlus"
              styles={{root: {fontWeight: FontWeights.regular}}}
              children={title}
            />
            {subtitle ? <Text variant="large" children={subtitle}/> : null}
          </Stack>

          {children ? <Stack tokens={{childrenGap: 15}} children={children} /> : null}

          {(buttons.length > 0 || footer) ? <Stack tokens={{childrenGap: 15}} verticalAlign="end">
            { error ? <MessageBar messageBarType={MessageBarType.error} styles={{root: AnimationStyles.slideDownIn20}} children={error}/> : null }
            {buttons.map(({ primary, text, onClick, autoFocus, loading, tabIndex }, index) => {
              const Button = primary ? PrimaryButton : DefaultButton;
              return <Button key={index} tabIndex={tabIndex} autoFocus={autoFocus} checked={loading === true} allowDisabledFocus text={text} styles={ButtonStyles.large} onClick={onClick} />;
            })}
            {footer}
          </Stack> : null}
        </Stack>
    </ScrollView>
  );
};
