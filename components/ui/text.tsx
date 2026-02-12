import { Theme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { FC } from "react";
import {
  Text as PrimitiveText,
  TextProps as PrimitiveTextProps,
} from "react-native";
import { sv, VariantProps } from "style-variants";

const getFontSizeStyle = (fontSize: number) => ({
  fontSize,
  lineHeight: fontSize * 1.5,
});
export const textVariants = (theme: Theme) =>
  sv({
    base: {},
    variants: {
      size: {
        xs: getFontSizeStyle(12),
        sm: getFontSizeStyle(14),
        base: getFontSizeStyle(16),
        lg: getFontSizeStyle(18),
        xl: getFontSizeStyle(20),
        "2xl": getFontSizeStyle(24),
        "3xl": getFontSizeStyle(28),
        "4xl": getFontSizeStyle(32),
      },
      color: {
        foreground: { color: theme.foreground },
        primaryForeground: { color: theme.primaryForeground },
        mutedForeground: { color: theme.mutedForeground },
        destructive: { color: theme.destructive },
        secondaryForeground: { color: theme.secondaryForeground },
      },
      weight: {
        regular: { fontFamily: "Geist_400Regular" },
        medium: { fontFamily: "Geist_500Medium" },
        semiBold: { fontFamily: "Geist_600SemiBold" },
        bold: { fontFamily: "Geist_700Bold" },
        extraBold: { fontFamily: "Geist_800ExtraBold" },
        black: { fontFamily: "Geist_900Black" },
      },
    },
    defaultVariants: {
      size: "base",
      weight: "regular",
      color: "foreground",
    },
  });

export type TextProps = PrimitiveTextProps &
  VariantProps<ReturnType<typeof textVariants>>;
export const Text: FC<TextProps> = ({
  style,
  size = "base",
  weight = "regular",
  color = "foreground",
  ...props
}) => (
  <PrimitiveText
    style={textVariants(useTheme())({ style, color, weight, size })}
    {...props}
  />
);
