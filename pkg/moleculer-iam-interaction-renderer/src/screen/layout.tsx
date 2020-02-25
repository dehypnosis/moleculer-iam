import React, { ReactElement } from "react";
import { ScrollView } from "react-native";
import { FontWeights, Image, Stack, Text, AnimationStyles, ButtonStyles, DefaultButton, PrimaryButton, MessageBar, MessageBarType } from "../styles";
import logo from "../image/logo.svg";

export const ScreenLayout: React.FunctionComponent<{
  title?: string | ReactElement,
  subtitle?: string | ReactElement,
  buttons?: {
    text: string,
    autoFocus?: boolean,
    onClick?: () => void|Promise<void>,
    primary?: boolean,
    loading?: boolean,
    tabIndex?: number,
  }[],
  footer?: ReactElement,
  error?: string,
}> = (props) => {
  const {title = "TODO", subtitle = null, children = null, buttons = [], error = null, footer = null} = props;
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
            <Text variant="large" children={subtitle}/>
          </Stack>

          <Stack tokens={{childrenGap: 15}} children={children} />

          <Stack tokens={{childrenGap: 15}} verticalAlign="end">
            { error ? <MessageBar messageBarType={MessageBarType.error} styles={{root: AnimationStyles.slideDownIn20}} children={typeof error === "string" ? error : JSON.stringify(error || "Unknown Error.")}/> : null }
            {buttons.map(({ primary, text, onClick, autoFocus, loading, tabIndex }, index) => {
              const Button = primary ? PrimaryButton : DefaultButton;
              return <Button key={index} tabIndex={tabIndex} autoFocus={autoFocus} checked={loading === true} allowDisabledFocus text={text} styles={ButtonStyles.large} onClick={loading ? undefined : onClick} />;
            })}
            {footer}
          </Stack>
        </Stack>
    </ScrollView>
  );
};
