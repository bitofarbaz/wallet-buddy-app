import {
  Breadcrumb,
  BreadcrumbScreen,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { useBillsQuery } from "@/features/bills/api/get-bills";
import { ListItemBill } from "@/features/bills/components/list-item-bill";
import { FlatList } from "react-native";

export default function IndexScreen() {
  const billsQuery = useBillsQuery();
  return (
    <>
      <ScreenHeader>
        <Breadcrumb>
          <BreadcrumbSeparator />
          <BreadcrumbScreen>Dashboard</BreadcrumbScreen>
        </Breadcrumb>
        <ScreenTitle>Dashboard</ScreenTitle>
        <ScreenDescription>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde
          deserunt sed non.
        </ScreenDescription>
      </ScreenHeader>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={billsQuery.data || []}
        renderItem={({ item }) => <ListItemBill bill={item} />}
      />
    </>
  );
}
