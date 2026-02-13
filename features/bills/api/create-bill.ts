import { mutationOptions, useMutation } from "@tanstack/react-query";

type CreateBillDTO = {};
const createBill = async (variables: CreateBillDTO) => {};

const createBillMutationOptions = mutationOptions({
  mutationFn: createBill,
});

export const useCreateBillMutation = () =>
  useMutation(createBillMutationOptions);
