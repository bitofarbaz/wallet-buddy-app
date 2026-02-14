import { z } from "zod";

export const SplitMethodSchema = z.enum(["equally", "shares", "exact_amount"]);
export const PaymentStatusSchema = z.enum([
  "paid_same_day",
  "paid_different_day",
  "unpaid",
]);

export const BillFormSchema = z
  .object({
    category_id: z.string(),
    title: z.string(),
    invoiced_at: z.date(),
    due_at: z.date().nullish(),
    split_method: SplitMethodSchema,
    amount_total: z.number().gt(0),
    shares: z.array(
      z.object({
        user_id: z.string(),
        share_value: z.number(),
      }),
    ),
  })
  .and(
    z.discriminatedUnion("payment_status", [
      z.object({
        payment_status: z.literal(PaymentStatusSchema.enum.paid_same_day),
        paid_by_id: z.string(),
      }),
      z.object({
        payment_status: z.literal(PaymentStatusSchema.enum.paid_different_day),
        paid_at: z.date(),
        paid_by_id: z.string(),
      }),
      z.object({
        payment_status: z.literal(PaymentStatusSchema.enum.unpaid),
      }),
    ]),
  );

export type BillFormValues = z.infer<typeof BillFormSchema>;
