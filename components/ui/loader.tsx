import { useTheme } from "@/hooks/use-theme";
import { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "./icon";
import { Spin } from "./spin";
import { Text, TextProps } from "./text";

export const Loader: FC<PropsWithChildren> = (props) => {
  const theme = useTheme();
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          gap: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
        },
      ]}
      {...props}
    />
  );
};

export const LoaderText: FC<TextProps> = (props) => (
  <Text color="mutedForeground" {...props} />
);

export const LoaderIcon: FC = () => (
  <Spin>
    <Icon name="loading" />
  </Spin>
);
