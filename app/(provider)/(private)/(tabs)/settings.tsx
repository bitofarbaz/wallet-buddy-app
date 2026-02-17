import {
  Breadcrumb,
  BreadcrumbScreen,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Header, HeaderBackButton } from "@/components/ui/header";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { ListItemProfile } from "@/features/profiles/components/list-item-profile";
import { useLogoutMutation } from "@/lib/auth";
import { useProfile } from "@/stores/profile.context";
import { View } from "react-native";

export default function SettingsScreen() {
  const { mutateAsync: logoutAsync } = useLogoutMutation();
  const profile = useProfile();
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
      <View style={{ flex: 1, paddingBottom: 24 }}>
        <FieldGroup style={{ flex: 1 }}>
          <Card style={{ paddingBlock: 8, paddingHorizontal: 16 }}>
            <ListItemProfile profile={profile} />
          </Card>
          <View style={{ flex: 1 }} />
          <Button variant="secondary" onPress={() => logoutAsync()}>
            <ButtonText>Logout</ButtonText>
          </Button>
        </FieldGroup>
      </View>
    </>
  );
}
