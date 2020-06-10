// fix react-native-web onPress bug on scrolling
// ref: https://github.com/necolas/react-native-web/issues/1219#issuecomment-500473912

import React, { useRef } from "react";
// @ts-ignore
import * as ReactNativeWeb from "react-native-web";
import PropTypes from "prop-types";

const fixTouchable = (Touchable: any) => (props: any) => {
  const { onPress, ...restProps } = props;
  const onClickCalled = useRef(false);
  const onClick = onPress ? ((e: any) => {
    // console.debug(onClickCalled, "onClick... invoked");
    onClickCalled.current = true;
    onPress(e);
  }) : undefined;
  const onPressAlternative = onPress ? ((e: any) => {
    setTimeout(() => {
      // console.debug(onClickCalled, "onPress... invoked");
      if (!onClickCalled.current) {
        onPress(e);
      }
    }, 100);
  }) : undefined;
  return (<Touchable {...restProps} onPress={onPressAlternative} onClick={onClick} />);
};

// @ts-ignore
export * from "react-native-web";
export const TouchableOpacity = fixTouchable(ReactNativeWeb.TouchableOpacity);
export const TouchableWithoutFeedback = fixTouchable(ReactNativeWeb.TouchableWithoutFeedback);
export const TouchableNativeFeedback = fixTouchable(ReactNativeWeb.TouchableNativeFeedback);
export const TouchableHighlight = fixTouchable(ReactNativeWeb.TouchableHighlight);

// shim view
export const ViewPropTypes = { style: PropTypes.any };
// export const ViewPropTypes = require("../../node_modules/react-native/Libraries/Components/View/ViewPropTypes");
export const ViewStyle = {};

// shim image
ReactNativeWeb.Image.resolveAssetSource = (uri: string) => ({ uri });

console.debug("shim: react-native -> react-native-web -> pkg/web/client.rnw.tsx");
