import { Button, ButtonText } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Text } from "@/components/ui/text";
import { useLogoutMutation } from "@/lib/auth";
import { View } from "react-native";

export default function SettingsScreen() {
  const { mutateAsync: logoutAsync } = useLogoutMutation();
  return (
    <View style={{ flex: 1, paddingBottom: 12 }}>
      <Text>Hello /settings</Text>
      <View style={{ flex: 1 }} />
      <FieldGroup>
        <Button onPress={() => logoutAsync()}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </FieldGroup>
    </View>
  );
}
