import { supabase } from "@/lib/supabase";
import { useSession } from "@/stores/session.context";
import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { TransferFormValues } from "../config/create-transfer-schema";
import { transfersQueryOptions } from "./get-transfers";

const createTransfer = async (
  variables: TransferFormValues & { user_id: string },
) => {
  const { amount_total, contact_id, transferred_at, user_id, type } = variables;
  const [from_user_id, to_user_id] =
    type === "sent" ? [user_id, contact_id] : [contact_id, user_id];

  const { data, error } = await supabase
    .from("transfers")
    .insert([
      {
        to_user_id,
        amount_total,
        from_user_id,
        transferred_at: transferred_at.toISOString(),
      },
    ])
    .select("*")
    .single();

  if (error) throw error;
  if (!data) throw new Error();

  return data;
};

const getCreateTransferMutationOptions = (user_id: string) =>
  mutationOptions({
    mutationFn: (variables: TransferFormValues) =>
      createTransfer({ ...variables, user_id }),
  });

export const useCreateTransferMutation = () => {
  const {
    user: { id: user_id },
  } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    ...getCreateTransferMutationOptions(user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transfersQueryOptions.queryKey,
      });
    },
  });
};
