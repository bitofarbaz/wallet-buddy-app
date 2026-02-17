import { useTheme } from "@/hooks/use-theme";
import { FC } from "react";
import { View, ViewProps } from "react-native";

export const Card: FC<ViewProps> = ({ style, ...props }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          paddingBlock: 16,
          backgroundColor: theme.card,
          borderRadius: theme.radius,
          borderColor: theme.accent,
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    />
  );
};
