import { Stack } from "@/components/ui/stack";
import { useTheme } from "@/hooks/use-theme";
import { PortalProvider } from "@gorhom/portal";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  const theme = useTheme();
  return (
    <GestureHandlerRootView>
      <PortalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.background,
              paddingTop: StatusBar.currentHeight,
            },
          }}
        />
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
