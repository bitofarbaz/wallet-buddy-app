import { Button, ButtonText } from "@/components/ui/button";
import { Header, HeaderTitle } from "@/components/ui/header";
import { Text } from "@/components/ui/text";
import { useLogoutMutation } from "@/lib/auth";
import { useProfile } from "@/stores/profile.context";
import { View } from "react-native";

export default function IndexScreen() {
  const { name } = useProfile();
  const { mutateAsync: logoutAsync, isPending } = useLogoutMutation();
  return (
    <View style={{ flex: 1 }}>
      <Header>
        <HeaderTitle>Wallet Buddy — Lite</HeaderTitle>
      </Header>
      <Text>Hello {name}</Text>
      <Button
        isLoading={isPending}
        onPress={() => {
          logoutAsync();
        }}
      >
        <ButtonText>Logout</ButtonText>
      </Button>
    </View>
  );
}
