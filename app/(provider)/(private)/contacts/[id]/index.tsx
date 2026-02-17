import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbScreen,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, ButtonText } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Header, HeaderBackButton } from "@/components/ui/header";
import { Loader, LoaderIcon, LoaderText } from "@/components/ui/loader";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { useProfileQuery } from "@/features/profiles/api/get-profile";
import { Link, Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

export default function ContactScreen() {
  const { id } = useGlobalSearchParams() as { id: string };
  const router = useRouter();
  const profileQuery = useProfileQuery(id);
  if (profileQuery.isLoading)
    return (
      <Loader>
        <LoaderIcon />
        <LoaderText>Fetching profile...</LoaderText>
      </Loader>
    );
  const profile = profileQuery.data;
  if (!profile)
    return <Redirect href={"/(provider)/(private)/(tabs)/contacts"} />;
  return (
    <>
      <Header>
        <HeaderBackButton />
      </Header>
      <ScreenHeader>
        <Breadcrumb>
          <BreadcrumbSeparator />
          <Link href={"/(provider)/(private)/(tabs)/contacts"}>
            <BreadcrumbItem>Contacts</BreadcrumbItem>
          </Link>
          <BreadcrumbSeparator />
          <BreadcrumbScreen>#{profile.id.slice(-4)}</BreadcrumbScreen>
        </Breadcrumb>
        <ScreenTitle>{profile.name}</ScreenTitle>
        <ScreenDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, illo.
        </ScreenDescription>
      </ScreenHeader>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1 }} />
        <FieldGroup>
          <Button onPress={() => router.navigate("/transfers/new")}>
            <ButtonText>Create transfer</ButtonText>
          </Button>
          <View></View>
        </FieldGroup>
      </ScrollView>
    </>
  );
}
