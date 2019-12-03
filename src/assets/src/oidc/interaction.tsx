import React, { Component, ReactElement } from "react";
import { FontWeights, Image, Stack, Text } from "office-ui-fabric-react/lib";
import logo from "../image/logo.svg";

export class Interaction extends Component<{
  title: string,
  subtitle?: string,
  footer?: ReactElement | ReactElement[],
}, any> {
  public render() {
    const {title, subtitle, children, footer} = this.props;
    return (
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        verticalFill
        styles={{
          root: {
            minWidth: "360px",
            maxWidth: "450px",
            minHeight: "600px",
            margin: "0 auto",
            padding: "0 0 80px",
            color: "#605e5c",
          },
        }}
      >
        <Stack
          tokens={{childrenGap: 30}}
          styles={{
            root: {
              padding: "30px",
              width: "100%",
              minHeight: "600px",
            },
          }}
        >
          <Stack>
            <Image src={logo} styles={{root: {height: "47px"}}} shouldFadeIn/>
          </Stack>

          <Stack tokens={{childrenGap: 5}}>
            <Text
              variant="xLargePlus"
              styles={{root: {fontWeight: FontWeights.regular}}}
              children={title}
            />
            {subtitle
              ? <Text variant="large" children={subtitle}/>
              : null}
          </Stack>

          {children
            ? <Stack styles={{root: {flex: "5 1 auto"}}} children={children} />
            : null}

          {footer
            ? <Stack tokens={{childrenGap: 15}} verticalAlign="end" children={footer} />
            : null}
        </Stack>
      </Stack>
    );
  }
}
