import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.muted, borderTopWidth: 0 },
        sceneStyle: { backgroundColor: theme.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text size="xs" color={focused ? "primary" : "mutedForeground"}>
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home-outline"
              color={focused ? theme.primary : theme.mutedForeground}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text size="xs" color={focused ? "primary" : "mutedForeground"}>
              Contacts
            </Text>
          ),

          tabBarIcon: ({ focused }) => (
            <Icon
              name="account-group-outline"
              color={focused ? theme.primary : theme.mutedForeground}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cta"
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                borderRadius: 60,
                marginTop: -12,
                marginHorizontal: "auto",
                backgroundColor: theme.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="plus" size={32} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text size="xs" color={focused ? "primary" : "mutedForeground"}>
              History
            </Text>
          ),

          tabBarIcon: ({ focused }) => (
            <Icon
              name="history"
              color={focused ? theme.primary : theme.mutedForeground}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text size="xs" color={focused ? "primary" : "mutedForeground"}>
              Settings
            </Text>
          ),

          tabBarIcon: ({ focused }) => (
            <Icon
              name="cog-outline"
              color={focused ? theme.primary : theme.mutedForeground}
            />
          ),
        }}
      />
    </Tabs>
  );
}
