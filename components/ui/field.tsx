import { FC } from "react";
import { View, ViewProps } from "react-native";
import { Text, TextProps } from "./text";

export const FieldGroup: FC<ViewProps> = ({ style, ...props }) => (
  <View style={[{ gap: 24, padding: 16 }, style]} {...props} />
);

export const Field: FC<ViewProps> = ({ style, ...props }) => (
  <View style={[{ gap: 12 }, style]} {...props} />
);

export const FieldError: FC<{ error: string | undefined } & TextProps> = ({
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
