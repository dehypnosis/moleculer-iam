import React from "react";
import { View } from "react-native";
import { Text, useThemePalette } from "./index";

export const Separator: React.FunctionComponent<{text?: string, marginTop?: number, marginBottom?: number}> = ({ text, marginTop = 10, marginBottom = 20 }) => {
  const palette = useThemePalette();

  return (
    <View style={{position: "relative", marginTop, marginBottom}}>
      <View style={{borderTopWidth: 1, borderTopColor: palette["text-disabled-color"], position: "absolute", top: "50%", width: "100%", left: "0%", height: 1}}/>
      {text ? (
        <View style={{flexDirection: "row"}}>
          <View style={{flexGrow:1}}/>
            <Text category={"c1"} appearance={"hint"} style={{textAlign: "center", flexGrow: 0, paddingLeft: 10, paddingRight: 10, backgroundColor: palette["background-basic-color-1"]}}>
              {text}
            </Text>
          <View style={{flexGrow:1}}/>
        </View>
      ) : (
        <Text category={"c1"}> </Text>
      )}
    </View>
  )
}
