import { useTheme } from "@/hooks/use-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps, FC } from "react";

export type IconProps = ComponentProps<typeof MaterialCommunityIcons>;
export const Icon: FC<IconProps> = (props) => {
  const theme = useTheme();
  return (
    <MaterialCommunityIcons color={theme.foreground} size={24} {...props} />
  );
};
