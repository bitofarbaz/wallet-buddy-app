import { supabase } from "@/lib/supabase";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getBills = async () => {
  const response = await supabase
    .from("bills")
    .select("*, bill_shares(*), category:categories(*)");

  const { data, error } = response;
  if (error) throw error;

  return data;
};

export const billsQueryOptions = queryOptions({
  queryKey: ["bills"],
  queryFn: getBills,
});

export const useBillsQuery = () => useQuery(billsQueryOptions);
