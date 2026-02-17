import { supabase } from "@/lib/supabase";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getTransfers = async () => {
  const getContactsResponse = await supabase
    .from("transfers")
    .select(
      "*, from_user:profiles!from_user_id(*), to_user:profiles!to_user_id(*)",
    );
  if (getContactsResponse.error) throw getContactsResponse.error;
  return getContactsResponse.data;
};

export const transfersQueryOptions = queryOptions({
  queryKey: ["transfers"],
  queryFn: getTransfers,
});

export const useTransfersQuery = () => {
  return useQuery(transfersQueryOptions);
};
