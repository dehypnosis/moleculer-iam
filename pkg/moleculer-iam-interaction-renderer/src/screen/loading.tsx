import React from "react";
import { ISpinnerProps, Spinner, SpinnerSize, Stack } from "../styles";

export const LoadingScreen: React.FunctionComponent<ISpinnerProps> = ({
                                                                        size = SpinnerSize.large,
                                                                        label = "Loading",
                                                                        ...otherProps
                                                                      }) => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      children={<Spinner size={size} label={label} {...otherProps} />}
    />
  );
};
