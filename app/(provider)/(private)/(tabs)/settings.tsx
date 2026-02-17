import {
  Breadcrumb,
  BreadcrumbScreen,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, ButtonText } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Header, HeaderBackButton } from "@/components/ui/header";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { useLogoutMutation } from "@/lib/auth";
import { View } from "react-native";

export default function SettingsScreen() {
  const { mutateAsync: logoutAsync } = useLogoutMutation();
  return (
    <>
      <Header>
        <HeaderBackButton />
      </Header>
      <ScreenHeader>
        <Breadcrumb>
          <BreadcrumbSeparator />
          <BreadcrumbScreen>Settings</BreadcrumbScreen>
        </Breadcrumb>
        <ScreenTitle>Settings</ScreenTitle>
        <ScreenDescription>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde
          deserunt sed non.
        </ScreenDescription>
      </ScreenHeader>
      <View style={{ flex: 1, paddingBottom: 12 }}>
        <View style={{ flex: 1 }} />
        <FieldGroup>
          <Button variant="secondary" onPress={() => logoutAsync()}>
            <ButtonText>Logout</ButtonText>
          </Button>
        </FieldGroup>
      </View>
    </>
  );
}
