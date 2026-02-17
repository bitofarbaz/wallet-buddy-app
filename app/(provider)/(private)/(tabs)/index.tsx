import {
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetRef,
  BottomSheetTitle,
  DetachedBottomSheet,
} from "@/components/ui/bottom-sheet";
import {
  Breadcrumb,
  BreadcrumbScreen,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, ButtonText } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { Text } from "@/components/ui/text";
import { useDeleteBillMutation } from "@/features/bills/api/delete-bill";
import { useBillsQuery } from "@/features/bills/api/get-bills";
import { ListItemBill } from "@/features/bills/components/list-item-bill";
import { useTransfersQuery } from "@/features/transfers/api/get-transfers";
import { ListItemTransfer } from "@/features/transfers/components/list-item-transfer";
import { useTheme } from "@/hooks/use-theme";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FC, PropsWithChildren, useRef } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

const DeleteBill: FC<{ id: string } & PropsWithChildren> = ({
  id,
  children,
}) => {
  const ref = useRef<BottomSheetRef>(null!);
  const { mutateAsync: deleteBillAsync } = useDeleteBillMutation();
  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          ref.current.expand();
        }}
      >
        {children}
      </TouchableOpacity>
      <DetachedBottomSheet ref={ref}>
        <BottomSheetView>
          <BottomSheetHeader>
            <BottomSheetTitle>Delete Bill #{id.slice(-4)}</BottomSheetTitle>
            <BottomSheetDescription>
              This action is irreversible, are you sure you want to delete the
              bill?
            </BottomSheetDescription>
          </BottomSheetHeader>
          <FieldGroup>
            <Field>
              <Button
                variant="destructive"
                onPress={() => {
                  deleteBillAsync(id);
                }}
              >
                <ButtonText>Confirm</ButtonText>
              </Button>
              <Button variant="secondary" onPress={() => ref.current.close()}>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </Field>
          </FieldGroup>
        </BottomSheetView>
      </DetachedBottomSheet>
    </>
  );
};

export default function IndexScreen() {
  const theme = useTheme();
  const billsQuery = useBillsQuery();
  const transfersQuery = useTransfersQuery();
  const transactions = [
    ...(billsQuery.data || []).map((bill) => ({
      ...bill,
      __typename: "Bill" as const,
    })),
    ...(transfersQuery.data || []).map((transfer) => ({
      ...transfer,
      __typename: "Transfer" as const,
    })),
  ];
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
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={transactions}
        renderItem={({ item }) =>
          item.__typename === "Bill" ? (
            <DeleteBill id={item.id}>
              <ListItemBill bill={item} />
            </DeleteBill>
          ) : (
            <ListItemTransfer transfer={item} />
          )
        }
        ListHeaderComponentStyle={{ marginBottom: 24 }}
        ListHeaderComponent={() => (
          <View
            style={{
              paddingBlock: 16,
              backgroundColor: theme.card,
              borderRadius: theme.radius,
              borderColor: theme.accent,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="sm" color="mutedForeground">
              Spent this month
            </Text>
            <Text size="xl" weight="semiBold">
              Rs 12,345.67
            </Text>
          </View>
        )}
      />
    </>
  );
}
