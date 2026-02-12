import { FC } from "react";
import { View, ViewProps } from "react-native";
import { Text, TextProps } from "./text";

export const FieldGroup: FC<ViewProps> = (props) => (
  <View style={{ gap: 24, padding: 16 }} {...props} />
);

export const Field: FC<ViewProps> = (props) => (
  <View style={{ gap: 12 }} {...props} />
);

export const FieldError: FC<{ error?: string } & TextProps> = ({
  error,
  ...props
}) => {
  if (!error) return null;
  return (
    <Text size="sm" color="destructive" {...props}>
      {error}
    </Text>
  );
};
