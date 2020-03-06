import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { Text, Avatar, useThemePalette } from "./index";

type PersonaProps = {
  name?: string;
  email?: string;
  picture?: string;
  style?: ViewStyle,
};

export const Persona: React.FunctionComponent<PersonaProps> = ({ name = "?", email = "?", picture, style }) => {
  const size = 50;
  const palette = useThemePalette();
  const [pictureVisible, setPictureVisible] = useState(!!picture);
  return (
    <View style={style}>
      <View style={{
        flexDirection: "row",
      }}>
        <View style={{
          width: size,
          height: size,
          flexBasis: size,
          flexShrink: 0,
          marginRight: 15,
          alignSelf: "center",
          position: "relative",
        }}>
          {pictureVisible ? (
            <Avatar
              source={{uri: picture}}
              onError={err => setPictureVisible(false)}
              style={{
                width: size + 2,
                height: size + 2,
                resizeMode: "stretch",
                backgroundColor: palette["background-basic-color-2"],
              }}
            />
          ) : (
            <View style={{
              width: size,
              height: size,
              borderRadius: size/2,
              backgroundColor: palette["background-basic-color-2"],
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: -size/10,
                  color: palette["text-hint-color"],
                }}
                children={name[0] || "?"}
                category={"h4"}
                appearance={"alternative"}/>
            </View>
          )}
        </View>
        <View style={{
          justifyContent: "center",
          flexDirection: "column",
          flexGrow: 1,
          flexShrink: 1,
        }}>
          <Text category={"h6"} style={{marginBottom: 2}}>{name}</Text>
          <Text category={"p2"}>{email}</Text>
        </View>
      </View>
    </View>
  );
};
