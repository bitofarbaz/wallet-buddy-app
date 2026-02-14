import { Header, HeaderTitle } from "@/components/ui/header";
import { useBillsQuery } from "@/features/bills/api/get-bills";
import { ListItemBill } from "@/features/bills/components/list-item-bill";
import { FlatList } from "react-native";

export default function IndexScreen() {
  const billsQuery = useBillsQuery();
  return (
    <>
      <Header>
        <HeaderTitle>Wallet Buddy — Home</HeaderTitle>
      </Header>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={billsQuery.data || []}
        renderItem={({ item }) => <ListItemBill bill={item} />}
      />
    </>
  );
}
