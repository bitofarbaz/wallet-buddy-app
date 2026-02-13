import { useTheme } from "@/hooks/use-theme";
import { createContext, FC, PropsWithChildren, useContext } from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Text, TextProps } from "./text";

type RadioGroupValueProps = {
  value: string;
  onChange: (value: string) => void;
};

const RadioGroupValuePropsContext = createContext<RadioGroupValueProps>(null!);
const useRadioGroupValuePropsContext = () =>
  useContext(RadioGroupValuePropsContext);

export const RadioGroup: FC<RadioGroupValueProps & PropsWithChildren> = ({
  children,
  ...props
}) => (
  <RadioGroupValuePropsContext.Provider value={props}>
    <View style={{ gap: 8 }}>{children}</View>
  </RadioGroupValuePropsContext.Provider>
);

export const RadioItem: FC<TouchableOpacityProps & { value: string }> = ({
  value,
  children,
  ...props
}) => {
  const propsContext = useRadioGroupValuePropsContext();
  return (
    <TouchableOpacity
      onPress={() => propsContext.onChange(value)}
      style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
      {...props}
    >
      <RadioIcon selected={value === propsContext.value} />
      {children}
    </TouchableOpacity>
  );
};

export const RadioIcon: FC<{ selected?: boolean }> = ({ selected }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 16,
        height: 16,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: theme.border,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected && (
        <View
          style={{
            height: 8,
            width: 8,
            borderRadius: 8,
            backgroundColor: theme.border,
          }}
        />
      )}
    </View>
  );
};

export const RadioLabel: FC<TextProps> = (props) => <Text {...props} />;
