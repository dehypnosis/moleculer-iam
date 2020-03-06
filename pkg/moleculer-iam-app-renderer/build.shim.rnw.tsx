// fix react-native-web onPress bug on ScrollView
// ref: https://github.com/necolas/react-native-web/issues/1219#issuecomment-500473912

import React from "react"
// @ts-ignore
import * as ReactNativeWeb from "react-native-web";

const fixTouchable = (Touchable: any) => (props: any) => {
  const { onPress, ...restProps } = props;
  const onClick = onPress ? ((e: any) => {
    e.nativeEvent.stopPropagation();
    onPress(e);
  }) : undefined;
  return (
    <Touchable {...restProps} onClick={onClick} />)
};


// @ts-ignore
export * from "react-native-web";
export const TouchableOpacity = fixTouchable(ReactNativeWeb.TouchableOpacity)
export const TouchableWithoutFeedback = fixTouchable(ReactNativeWeb.TouchableWithoutFeedback)
