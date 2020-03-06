import React from "react";
import { View, ViewStyle } from "react-native";
import { Text, Avatar } from "./index";

type PersonaProps = {
  name?: string;
  email?: string;
  picture?: string;
  style?: ViewStyle,
};

export const Persona: React.FunctionComponent<PersonaProps> = ({ name = "unknown", email = "unknown", picture, style }) => {
  return (
    <View style={style}>
      <View style={{
        flexDirection: "row",
      }}>
        <Avatar
          source={{uri: picture}}
          style={{
            width: 50,
            height: 50,
            flexBasis: 50,
            flexShrink: 0,
            marginRight: 15,
            resizeMode: "stretch",
            alignSelf: "center",
          }}
        />
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
