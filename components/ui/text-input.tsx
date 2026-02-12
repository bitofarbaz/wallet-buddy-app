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
import { textVariants } from "./text";

const inputGroupVariants = (theme: Theme) =>
  sv({
    base: {
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
      style={textVariants(theme)()}
      placeholderTextColor={theme.mutedForeground}
      {...props}
    />
  );
};
