import { ButtonGroupProps } from "@ui-kitten/components";
import React, { ReactElement } from "react";
import { ScrollView, Image, View } from "react-native";
import { useAppOptions } from "../../hook";
import { Text, Button, ButtonGroup, ButtonProps, withAttrs, Separator, activeAutoFocus } from "./index";
import logo from "../../assets/logo.svg";

type LayoutFooterButtonGroupProps = {
  hidden?: boolean;
  group: LayoutFooterButtonProps[];
} & Omit<ButtonGroupProps, "children">;

type LayoutFooterButtonProps = {
  tabIndex?: number
  hidden?: boolean;
} & ButtonProps;

type LayoutFooterSeparatorProps = {
  separator: string | true;
  hidden?: boolean;
}

export const ScreenLayout: React.FunctionComponent<{
  title?: string | ReactElement,
  subtitle?: string | ReactElement,
  loading?: boolean;
  buttons?: (LayoutFooterButtonProps | LayoutFooterSeparatorProps | LayoutFooterButtonGroupProps)[],
  footer?: ReactElement,
  error?: string,
}> = ({title = "undefined", subtitle = null, loading = false, children = null, buttons = [], error = null, footer = null}) => {

  {/*<View style={{
        top: 0, right: 0, zIndex: 1000, alignItems: "flex-end", flex: 0,
        ...({
          position: "sticky",
          transition: "opacity 1s",
          opacity: loading ? 0.3 : 0,
        } as unknown as ViewStyle)
      }}>
        <View style={{margin: 20}}>
          <Spinner size={"tiny"} status={"primary"} />
        </View>
      </View>*/
  }

  const [options] = useAppOptions();
  return (
    <ScrollView
      ref={ref => ref && activeAutoFocus(ref.getInnerViewNode())}
      style={{width: "100%"}}
      contentContainerStyle={{justifyContent: "center", width: "100%", margin: "auto", padding: 30}}
    >
      <View style={{alignItems: options.logo.align, marginBottom: 20}}>
        <Image source={{uri: options.logo.uri || logo}} style={{height: options.logo.height, width: options.logo.width, resizeMode: "contain"}}/>
      </View>

      <View style={{marginBottom: 45}}>
        <Text category={"h5"}>{title}</Text>
        {subtitle && <Text category={"s2"} style={{marginTop: 5}}>{subtitle}</Text>}
      </View>

      {children ? <View style={{marginBottom: 30}}>{children}</View> : null}

      <View>
        {error ? <Text status={"danger"} category={"c2"} style={{marginBottom: 15}}>{error}</Text> : null}

        {buttons.length > 0 ? (
          buttons.map((args, index) => {
            if (args.hidden === true) {
              return null;
            }

            // render separator
            const s = args as LayoutFooterSeparatorProps;
            if (s.separator) {
              return (
                <Separator
                  key={index}
                  text={typeof s.separator === "string" ? s.separator : undefined}
                />
              );
            }

            // render button groups
            const g = args as LayoutFooterButtonGroupProps;
            if (g.group) {
              const {group, ...groupProps} = g;
              console.log(groupProps);
              return (
                <View
                  key={index}
                  style={{marginBottom: 15}}
                >
                  <ButtonGroup
                    // default
                    status={"basic"}
                    size={"large"}
                    appearance={"filled"}

                    // custom
                    {...groupProps}
                  >
                    {g.group.map((btn, key) => {
                      // tslint:disable-next-line:no-shadowed-variable
                      const {hidden, tabIndex, ...props} = btn;
                      return (
                        <Button
                          ref={withAttrs({tabindex: tabIndex || null})}
                          key={key}

                          // default
                          status={"basic"}
                          size={"large"}
                          appearance={"filled"}
                          style={{flexGrow: 1, flexShrink: 1}}
                          textStyle={{textAlign: "center"}}

                          // custom
                          {...props}

                          // override
                          onPress={loading ? undefined : props.onPress}
                          onPressOut={loading ? undefined : props.onPressOut}
                          onPressIn={loading ? undefined : props.onPressIn}
                          onLongPress={loading ? undefined : props.onLongPress}
                        />
                      );
                    })}
                  </ButtonGroup>
                </View>
              );
            }

            // render button
            const {hidden, tabIndex, ...props} = args as LayoutFooterButtonProps;
            return (
              <View
                key={index}
                style={{marginBottom: 15}}
              >
                <Button
                  ref={withAttrs({tabindex: tabIndex || null})}

                  // default
                  status={"basic"}
                  size={"large"}
                  appearance={"filled"}

                  // custom
                  {...props}

                  // override
                  onPress={loading ? undefined : props.onPress}
                  onPressOut={loading ? undefined : props.onPressOut}
                  onPressIn={loading ? undefined : props.onPressIn}
                  onLongPress={loading ? undefined : props.onLongPress}
                />
              </View>
            );
          })
        ) : null}

        {footer}
      </View>
    </ScrollView>
  );
};
