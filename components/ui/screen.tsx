import { FC } from "react";
import { View, ViewProps } from "react-native";
import { Text, TextProps } from "./text";

export const ScreenHeader: FC<ViewProps> = ({ style, ...props }) => (
  <View
    style={[{ marginBlock: 24, gap: 8, paddingHorizontal: 16 }, style]}
    {...props}
  />
);

export const ScreenTitle: FC<TextProps> = (props) => (
  <Text weight="semiBold" size="xl" {...props} />
);

export const ScreenDescription: FC<TextProps> = (props) => (
  <Text {...props} color="mutedForeground" />
);
