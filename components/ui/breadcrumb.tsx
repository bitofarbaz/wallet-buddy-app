import { Link, LinkProps } from "expo-router";
import { FC } from "react";
import { View, ViewProps } from "react-native";
import { Text, TextProps } from "./text";

export const Breadcrumb: FC<ViewProps> = ({ style, ...props }) => (
  <View style={[{ flexDirection: "row", gap: 6 }, style]} {...props} />
);

export const BreadcrumbSeparator: FC = () => (
  <Text size="sm" color="mutedForeground">
    /
  </Text>
);

export const BreadcrumbScreen: FC<TextProps> = (props) => (
  <Text size="sm" {...props} />
);

export const BreadcrumbLink: FC<LinkProps> = ({ children, ...props }) => (
  <Link {...props}>
    <Text size="sm">{children}</Text>
  </Link>
);
