import { Bill, BillShare } from "@/types/api";

export const getShareAmount = (
  bill: Pick<Bill, "split_type" | "amount_total"> & {
    bill_shares: BillShare[];
  },
  user_id: string,
) => {
  const share = bill.bill_shares.find((item) => item.user_id === user_id);
  if (!share) return 0;
  const payableIdx = bill.bill_shares
    .filter((item) => item.share_value)
    .findIndex((item) => item.user_id === user_id);
  switch (bill.split_type) {
    case "equally": {
      const totalShares =
        bill.bill_shares.reduce((acc, cv) => acc + cv.share_value, 0) || 1;
      const remainder = bill.amount_total % totalShares;
      const perShare = (bill.amount_total - remainder) / totalShares;

      return perShare * share.share_value + (payableIdx === 0 ? remainder : 0);
    }
    case "shares": {
      const totalShares =
        bill.bill_shares.reduce((acc, cv) => acc + cv.share_value, 0) || 1;
      const remainder = bill.amount_total % totalShares;
      const perShare = (bill.amount_total - remainder) / totalShares;

      return perShare * share.share_value + (payableIdx === 0 ? remainder : 0);
    }
    default:
      return share.share_value;
  }
};
