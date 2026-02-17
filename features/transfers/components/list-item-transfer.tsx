import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import { useTheme } from "@/hooks/use-theme";
import { useSession } from "@/stores/session.context";
import { Profile, Transfer } from "@/types/api";
import { FC } from "react";
import { View } from "react-native";
import { TransferType } from "../config/create-transfer-schema";

export const ListItemTransfer: FC<{
  transfer: Transfer & { from_user: Profile; to_user: Profile };
  secondaryText?: string;
}> = ({ transfer, secondaryText }) => {
  const theme = useTheme();
  const session = useSession();
  const format = useFormatCurrency();
  const type: TransferType =
    transfer.from_user_id === session.user.id ? "sent" : "received";
  const contact = type === "sent" ? transfer.to_user : transfer.from_user;
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
        <Icon name={type === "sent" ? "call-made" : "call-received"} />
      </View>
      <View style={{ flex: 1 }}>
        <Text weight="semiBold">{contact.name}</Text>
        <Text color="mutedForeground">
          {secondaryText ? secondaryText : `#${transfer.id.slice(-4)}`}
        </Text>
      </View>
      <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
        <Text color="mutedForeground">{type}</Text>
        <Text weight="semiBold">{format(transfer.amount_total)}</Text>
      </View>
    </View>
  );
};
