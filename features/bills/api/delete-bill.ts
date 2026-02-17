import { supabase } from "@/lib/supabase";
import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { billsQueryOptions } from "./get-bills";

const deleteBill = async (id: string) => {
  // delete shares
  await supabase.from("bill_shares").delete().eq("bill_id", id);
  // delete bill
  await supabase.from("bills").delete().eq("id", id);
  return id;
};

const deleteBillMutationOptions = mutationOptions({ mutationFn: deleteBill });

export const useDeleteBillMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteBillMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billsQueryOptions.queryKey });
    },
  });
};
