import { z } from "zod";

export const TransferTypeSchema = z.enum(["sent", "received"]);
export type TransferType = z.infer<typeof TransferTypeSchema>;

export const TransferFormSchema = z.object({
  contact_id: z.string(),
  amount_total: z.number().gt(0),
  transferred_at: z.date(),
  type: TransferTypeSchema,
});

export type TransferFormValues = z.infer<typeof TransferFormSchema>;
