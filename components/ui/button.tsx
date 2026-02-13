import { Theme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { createContext, FC, useContext } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { sv, VariantProps } from "style-variants";
import { Icon, IconProps } from "./icon";
import { Spin } from "./spin";
import { Text, TextProps } from "./text";

const buttonVariants = (theme: Theme) =>
  sv({
    base: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius,
    },
    variants: {
      isLoading: { true: {} },
      size: {
        md: {
          height: 40,
        },
        sm: {
          height: 28,
          paddingHorizontal: 12,
        },
        icon: {
          width: 40,
          height: 40,
          borderRadius: 40,
        },
      },
      variant: {
        default: { backgroundColor: theme.primary },
        secondary: { backgroundColor: theme.secondary },
      },
    },
    compoundVariants: [
      {
        isLoading: true,
        variant: "default",
        style: { backgroundColor: theme.muted },
      },
    ],
  });

export type ButtonProps = TouchableOpacityProps &
  VariantProps<ReturnType<typeof buttonVariants>>;
const PropsContext = createContext<ButtonProps>(null!);
const usePropsContext = () => useContext(PropsContext);

export const Button: FC<ButtonProps> = (props) => {
  const theme = useTheme();
  const {
    style,
    size = "md",
    variant = "default",
    isLoading,
    disabled,
    children,
    ...rest
  } = props;
  return (
    <PropsContext.Provider value={{ style, size, variant, ...rest }}>
      <TouchableOpacity
        style={buttonVariants(theme)({ style, size, variant, isLoading })}
        disabled={isLoading || disabled}
        {...rest}
      >
        {isLoading ? (
          <Spin>
            <Icon name="loading" color={theme.mutedForeground} />
          </Spin>
        ) : (
          children
        )}
      </TouchableOpacity>
    </PropsContext.Provider>
  );
};

export const ButtonText: FC<TextProps> = (props) => {
  const { variant } = usePropsContext();
  return (
    <Text
      weight="semiBold"
      size="sm"
      color={
        variant === "default"
          ? "primaryForeground"
          : variant === "secondary"
            ? "secondaryForeground"
            : "foreground"
      }
      {...props}
    />
  );
};

export const ButtonIcon: FC<IconProps> = (props) => {
  // const propsContext = usePropsContext();
  return <Icon {...props} />;
};
