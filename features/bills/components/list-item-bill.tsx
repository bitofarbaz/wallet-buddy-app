import { Text } from "@/components/ui/text";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import { useTheme } from "@/hooks/use-theme";
import { useSession } from "@/stores/session.context";
import { Bill, BillShare, Category } from "@/types/api";
import { FC, ReactNode } from "react";
import { View } from "react-native";
import { getShareAmount } from "../utils/get-share-amount";

export const ListItemBill: FC<{
  bill: Bill & { bill_shares: BillShare[]; category: Category };
  end?: ReactNode;
  secondaryText?: string;
}> = ({ bill, secondaryText, end }) => {
  const session = useSession();
  const format = useFormatCurrency();
  const theme = useTheme();
  return (
    <View
      style={{
        paddingBlock: 8,
        flexDirection: "row",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius,
          backgroundColor: theme.secondary,
        }}
      >
        <Text size="lg">{bill.category.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text weight="semiBold">{bill.title}</Text>
        <Text color="mutedForeground">
          {secondaryText ? secondaryText : `#${bill.id.slice(-4)}`}
        </Text>
      </View>
      <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
        <Text color="mutedForeground">your share</Text>
        <Text weight="semiBold">
          {format(getShareAmount(bill, session.user.id))}
        </Text>
      </View>
    </View>
  );
};
