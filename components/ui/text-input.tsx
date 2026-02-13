import { Theme } from "@/config/theme";
import { useTheme } from "@/hooks/use-theme";
import { createContext, FC, useContext } from "react";
import {
  TextInput as PrimitiveTextInput,
  TextInputProps as PrimitiveTextInputProps,
  TouchableOpacityProps,
  View,
} from "react-native";
import { sv, VariantProps } from "style-variants";
import { Icon, IconProps } from "./icon";
import { Text, TextProps, textVariants } from "./text";

const inputGroupVariants = (theme: Theme) =>
  sv({
    base: {
      alignItems: "center",
      flexDirection: "row",
      borderRadius: theme.radius,
      backgroundColor: theme.secondary,
    },
    variants: {
      size: {
        md: {
          paddingHorizontal: 8,
          height: 40,
        },
      },
    },
  });

export type InputGroupProps = TouchableOpacityProps &
  VariantProps<ReturnType<typeof inputGroupVariants>>;
const PropsContext = createContext<InputGroupProps>(null!);
const usePropsContext = () => useContext(PropsContext);

export const InputGroup: FC<InputGroupProps> = (props) => {
  const { style, size = "md", ...rest } = props;
  const theme = useTheme();
  return (
    <PropsContext.Provider value={{ style, size, ...rest }}>
      <View style={inputGroupVariants(theme)({ style, size })} {...rest} />
    </PropsContext.Provider>
  );
};

export const TextInput: FC<PrimitiveTextInputProps> = (props) => {
  const theme = useTheme();
  return (
    <PrimitiveTextInput
      style={textVariants(theme)({ style: { flex: 1 } })}
      placeholderTextColor={theme.mutedForeground}
      {...props}
    />
  );
};

export const InputValue: FC<
  Omit<TextProps, "children"> & {
    placeholder: string | undefined;
    children: string | boolean | undefined;
  }
> = ({ placeholder, children, ...props }) => {
  const isPlaceholder = !children;
  return (
    <Text
      color={isPlaceholder ? "mutedForeground" : "foreground"}
      style={{ flex: 1 }}
      {...props}
    >
      {isPlaceholder ? placeholder : children}
    </Text>
  );
};

export const InputIcon: FC<IconProps> = (props) => (
  <Icon size={18} style={{ marginHorizontal: 6 }} {...props} />
);
