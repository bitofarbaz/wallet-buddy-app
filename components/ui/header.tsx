import { Theme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { FC } from "react";
import { View, ViewProps } from "react-native";
import { sv, VariantProps } from "style-variants";
import { Button, ButtonIcon, ButtonProps } from "./button";
import { Text, TextProps } from "./text";

const headerVariants = (theme: Theme) =>
  sv({
    base: {
      gap: 16,
      height: 60,
      paddingHorizontal: 16,
      alignItems: "center",
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.secondary,
    },
    variants: {},
  });
export const Header: FC<
  ViewProps & VariantProps<ReturnType<typeof headerVariants>>
> = ({ style, ...props }) => {
  const theme = useTheme();
  return <View style={headerVariants(theme)({ style })} {...props} />;
};

export const HeaderBackButton: FC<ButtonProps> = ({ style, ...props }) => {
  const router = useRouter();
  return (
    <Button
      size="icon"
      variant="secondary"
      onPress={() => router.back()}
      {...props}
    >
      <ButtonIcon name="arrow-left" />
    </Button>
  );
};

export const HeaderTitle: FC<TextProps> = (props) => {
  // const propsContext = usePropsContext();
  return <Text weight="semiBold" {...props} />;
};
