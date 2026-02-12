import { useTheme } from "@/hooks/use-theme";
import { Stack as PrimitiveStack } from "expo-router";
import { ComponentProps, FC } from "react";

export const Stack: FC<ComponentProps<typeof PrimitiveStack>> = (props) => {
  const theme = useTheme();
  return (
    <PrimitiveStack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
      {...props}
    />
  );
};
