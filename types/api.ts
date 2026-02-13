import { Tables } from "./database";

export type Profile = Tables<"profiles">;
export type Category = Tables<"categories">;
export type Bill = Tables<"bills">;
export type BillShare = Tables<"bill_shares">;
