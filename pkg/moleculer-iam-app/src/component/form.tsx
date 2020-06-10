import moment from "moment";
import React, { useRef, useState } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { Input, InputProps, Icon, Datepicker, DatepickerProps, Select, SelectItem, IndexPath, SelectProps, Text, Autocomplete, AutocompleteProps } from "./index";
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
}> = ({onSubmit, children}) => {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) {
          onSubmit();
        }
      }}
    >
      {children}
    </form>
  );
};

export const FormInput: React.FunctionComponent<FormInputAliasProps> = (props) => {
  const {value, error, setValue, tabIndex, autoCompleteType, onEnter, autoFocus, secureTextEntry, ...restProps} = props;

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Input
      ref={ref => {
        withAttrs({tabindex: tabIndex || null, autofocus: autoFocus ? "autofocus" : null}, "input")(ref as any);
        if (ref && (ref as any).textInputRef.current) {
          (ref as any).textInputRef.current._node.style.width = "99%"; // fix icon marginalized bug
        }
      }}

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
      accessoryRight={secureTextEntry ? (evaProps => (
        <TouchableWithoutFeedback onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon
            {...evaProps}
            style={[evaProps?.style, {cursor: "pointer"} as any]}
            name={passwordVisible ? 'eye' : 'eye-off'}
          />
        </TouchableWithoutFeedback>
      )) : undefined}

      // custom
      {...restProps}

      // override
      caption={error || restProps.caption}
      status={error ? "danger" : (restProps.status || "basic")}
    />
  );
};

type FormDatePickerAliasProps = {
  value?: string;
  setValue?: (text: string) => void;
  error?: string;
  tabIndex?: number;
  format?: string;
} & Omit<DatepickerProps, "onSelect">;

export const FormDatePicker: React.FunctionComponent<FormDatePickerAliasProps> = (props) => {
  const {value, setValue, error, tabIndex, format = "YYYY-MM-DD", ...restProps} = props;
  const pickerRef = useRef<any>();
  return (
    <Datepicker
      ref={ref => {
        withAttrs({tabindex: tabIndex || null}, "[data-focusable=true]")(ref as any);
        pickerRef.current = ref;
      }}

      onFocus={() => {
        if (!value && setValue) {
          console.log("set value..");
          setValue(moment().subtract(20, "y").format(format));
        }
        if (pickerRef.current && !pickerRef.current.state.visible) {
          pickerRef.current.setPickerVisible();
        }
      }}
      label={""}
      placeholder={""}
      size={"large"}
      min={moment().subtract(100, "y").toDate()}
      max={moment().toDate()}
      date={value ? moment(value).toDate() : undefined}
      onSelect={v => {
        if (setValue) {
          setValue(moment(v).format(format));
        }
        if (pickerRef.current && pickerRef.current.state.visible) {
          pickerRef.current.setPickerInvisible();
        }
      }}
      accessoryRight={evaProps => <Icon {...evaProps} name="calendar"/>}

      // custom
      {...restProps}

      // override
      caption={error || restProps.caption}
      status={error ? "danger" : (restProps.status || "basic")}
    />
  );
};

type FormSelectAliasProps = {
  value?: string;
  setValue?: (text: string) => void;
  error?: string;
  tabIndex?: number;
  format?: string;
  data?: { value: any, text: string }[];
  caption?: string;
} & Omit<SelectProps, "onSelect">;

export const FormSelect: React.FunctionComponent<FormSelectAliasProps> = (props) => {
  const {value, setValue, error, data = [], tabIndex, caption, ...restProps} = props;
  const indexRow = data.findIndex(i => i.value === value);
  const index = indexRow > -1 ? new IndexPath(indexRow) : undefined;
  const item = indexRow > -1 ? data[indexRow] : undefined;
  const selectRef = useRef<any>();
  return (
    <>
      <Select
        ref={ref => {
          withAttrs({tabindex: tabIndex || null}, "[data-focusable=true]")(ref as any);
          selectRef.current = ref;
        }}

        onFocus={() => {
          // console.log(selectRef.current, !selectRef.current.state.optionsVisible);
          if (selectRef.current && !selectRef.current.state.optionsVisible) {
            selectRef.current.setOptionsListVisible();
          }
        }}
        onBlur={() => {
          if (selectRef.current && selectRef.current.state.optionsVisible) {
            selectRef.current.setOptionsListInvisible();
          }
        }}
        label={""}
        placeholder={""}
        size={"large"}
        onSelect={idx => {
          if (setValue) {
            const idxRow = (idx as IndexPath).row;
            setValue(data[idxRow].value);
          }
        }}
        value={item ? item.text : undefined}
        selectedIndex={index}

        // custom
        {...restProps}

        // override
        status={error ? "danger" : (restProps.status || "basic")}
      >
        {data.map((entry, key) => (
          <SelectItem key={key} title={entry.text} selected={entry.value === value} />
        ))}
      </Select>
      {(error || caption) ? (
        <Text category={"c1"} status={error ? "danger" : (restProps.status || "basic")}>{error || caption}</Text>
      ) : null}
    </>
  );
};

type FormAutoCompleteAliasProps = {
  value?: string;
  setValue?: (text: string) => void;
  error?: string;
  tabIndex?: number;
  data?: { value: string, title: string }[];
} & Omit<AutocompleteProps, "onSelect">;

export const FormAutoComplete: React.FunctionComponent<FormAutoCompleteAliasProps> = (props) => {
  const {value, setValue, error, data = [], tabIndex, style, ...restProps} = props;
  const selectRef = useRef<any>();
  return (
    <View style={style}>
      <Autocomplete
        ref={ref => {
          withAttrs({tabindex: tabIndex || null}, "[data-focusable=true]")(ref as any);
          selectRef.current = ref;
        }}

        onFocus={() => {
          console.log(selectRef.current, !selectRef.current);
          if (selectRef.current && !selectRef.current.state.optionsVisible) {
            selectRef.current.setState({ optionsVisible: true })
          }
        }}
        onBlur={() => {
          if (selectRef.current && selectRef.current.state.optionsVisible) {
            selectRef.current.setState({ optionsVisible: false })
          }
        }}
        label={""}
        placeholder={""}
        size={"large"}
        value={value}
        onSelect={row => {
          if (setValue) {
            setValue(data[row].value);
          }
        }}
        onChangeText={setValue ? (v => setValue(v)) : undefined}

        // custom
        {...restProps}

        // override
        caption={error || restProps.caption}
        status={error ? "danger" : (restProps.status || "basic")}
      >
        {data.map((entry, key) => (
          <SelectItem key={key} title={entry.title} selected={entry.value === value} />
        ))}
      </Autocomplete>
    </View>
  );
};
