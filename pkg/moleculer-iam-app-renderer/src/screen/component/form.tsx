import React from "react";
import { Input, InputProps } from "./index";
import { withAttrs } from "./util";

type FormInputAliasProps = {
  value?: string;
  setValue?: (text: string) => void;
  error?: string;
  tabIndex?: number;
  onEnter?: () => any;
  isPassword?: boolean;
} & InputProps;

export const Form: React.FunctionComponent<{
  onSubmit?: () => void;
}> = ({ onSubmit, children }) => {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
      }}
    >
      {children}
    </form>
  );
};

export const FormInput: React.FunctionComponent<FormInputAliasProps> = (props) => {
  const { value, error, setValue, tabIndex, onEnter, autoFocus, isPassword, ...restProps } = props;
  return (
    <Input
      ref={withAttrs({ tabindex: tabIndex || null, autofocus: autoFocus === true }, "input")}

      // default
      size={"large"}
      autoCapitalize={"none"}
      keyboardType={"default"}
      returnKeyType={"next"}
      autoCorrect={false}
      autoFocus={true}
      blurOnSubmit={typeof onEnter !== "function"}
      clearButtonMode={"while-editing"}
      label={""}
      placeholder={""}
      secureTextEntry={isPassword}
      autoCompleteType={isPassword ? "password" : undefined}
      value={value}
      onChangeText={setValue ? v => setValue(v || "") : undefined}
      onKeyPress={typeof onEnter === "function" ? e => e.nativeEvent.key === "Enter" && onEnter() : restProps.onKeyPress}

      // custom
      {...restProps}

      // override
      caption={error || restProps.caption}
      status={error ? "danger" : (restProps.status || "basic")}
    />
  );
};
