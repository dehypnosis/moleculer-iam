import React from "react";
import { useUserContext } from "./client";
import { Spinner, SpinnerSize, ISpinnerProps, Stack } from "../styles";

export const UserContextLoadingIndicator: React.FunctionComponent<{
  spinner?: ISpinnerProps,
}> = ({
  children,
  spinner = {
    size: SpinnerSize.large,
    label: "Loading...",
  },
}) => {
  const {loading} = useUserContext();
  return loading ? (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      children={<Spinner {...spinner}/>}
    />
  ) : (
    <>{children}</>
  );
};
