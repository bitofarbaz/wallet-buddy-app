import { supabase } from "@/lib/supabase";
import { useSession } from "@/stores/session.context";
import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { BillFormValues } from "../config/bill-form-schema";
import { billsQueryOptions } from "./get-bills";

type CreateBillDTO = BillFormValues & { user_id: string };
const createBill = async (variables: CreateBillDTO) => {
  const {
    amount_total,
    category_id,
    due_at,
    invoiced_at,
    payment_status,
    shares,
    split_method,
    title,
    user_id: created_by_id,
  } = variables;
  const response = await supabase
    .from("bills")
    .insert({
      title,
      category_id,
      amount_total,
      split_method,
      created_by_id,
      participant_ids: shares.map((share) => share.user_id),
      invoiced_at: invoiced_at.toISOString(),
      due_at: due_at?.toISOString() || null,
      ...(payment_status === "paid_different_day"
        ? {
            payment_status: "paid",
            paid_at: variables.paid_at.toISOString(),
            paid_by_id: variables.paid_by_id,
          }
        : payment_status === "paid_same_day"
          ? {
              payment_status: "paid",
              paid_at: invoiced_at.toISOString(),
              paid_by_id: variables.paid_by_id,
            }
          : {
              payment_status: "unpaid",
            }),
    })
    .select("*")
    .single();

  const { data, error } = response;

  if (!data) throw new Error();
  if (error) throw error;

  await supabase.from("bill_shares").insert(
    shares.map(({ share_value, user_id }) => ({
      user_id,
      share_value,
      bill_id: data.id,
    })),
  );
  return data;
};

const getCreateBillMutationOptions = (user_id: string) =>
  mutationOptions({
    mutationFn: (variables: BillFormValues) =>
      createBill({ ...variables, user_id }),
  });

export const useCreateBillMutation = () => {
  const {
    user: { id },
  } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    ...getCreateBillMutationOptions(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: billsQueryOptions.queryKey,
      });
    },
  });
};
