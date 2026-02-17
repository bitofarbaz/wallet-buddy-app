import {
  Breadcrumb,
  BreadcrumbScreen,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Header, HeaderBackButton } from "@/components/ui/header";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";

export default function HistoryScreen() {
  return (
    <>
      <Header>
        <HeaderBackButton />
      </Header>
      <ScreenHeader>
        <Breadcrumb>
          <BreadcrumbSeparator />
          <BreadcrumbScreen>History</BreadcrumbScreen>
        </Breadcrumb>
        <ScreenTitle>History</ScreenTitle>
        <ScreenDescription>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde
          deserunt sed non.
        </ScreenDescription>
      </ScreenHeader>
      {/* <Text>Hello /history</Text> */}
    </>
  );
}
