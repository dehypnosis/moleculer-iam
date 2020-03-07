import React, { useState } from "react";
import { Input, InputProps, Icon } from "./index";
import { withAttrs } from "./util";

type FormInputAliasProps = {
  value?: string;
  setValue?: (text: string) => void;
  error?: string;
  tabIndex?: number;
  onEnter?: () => any;
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
  const { value, error, setValue, tabIndex, autoCompleteType, onEnter, autoFocus, secureTextEntry, ...restProps } = props;

  const [passwordVisible, setPasswordVisible] = useState(false);


  return (
    <Input
      ref={withAttrs({ tabindex: tabIndex || null, autofocus: autoFocus ? "autofocus" : null }, "input")}

      // default
      size={"large"}
      autoCompleteType={autoCompleteType}
      autoCapitalize={"none"}
      keyboardType={"default"}
      returnKeyType={"next"}
      autoCorrect={false}
      autoFocus={autoFocus}
      blurOnSubmit={typeof onEnter !== "function"}
      clearButtonMode={"while-editing"}
      label={""}
      placeholder={""}
      secureTextEntry={secureTextEntry && !passwordVisible}
      value={value}
      onChangeText={setValue ? v => setValue(v || "") : undefined}
      onKeyPress={typeof onEnter === "function" ? e => e.nativeEvent.key === "Enter" && onEnter() : restProps.onKeyPress}
      icon={secureTextEntry ? (style => (<Icon style={{...style, ...({cursor: "pointer"} as any)}} name={passwordVisible ? 'eye' : 'eye-off'}/>)) : undefined}
      onIconPress={secureTextEntry ? (() => setPasswordVisible(!passwordVisible)) : undefined}

      // custom
      {...restProps}

      // override
      caption={error || restProps.caption}
      status={error ? "danger" : (restProps.status || "basic")}
    />
  );
};
