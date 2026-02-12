import { supabase } from "@/lib/supabase";
import { useSession } from "@/stores/session.context";
import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getContactsQueryOptions } from "./get-contacts";

interface CreateContactDTO {
  user_id: string;
  name: string;
}
const createContact = async (variables: CreateContactDTO) => {
  const { name, user_id } = variables;

  const createProfileResponse = await supabase
    .from("profiles")
    .insert({ name, parent_profile_id: user_id })
    .select("id")
    .single();

  if (createProfileResponse.error) throw createProfileResponse.error;
  if (!createProfileResponse.data) throw new Error();

  const createContactResponse = await supabase
    .from("contacts")
    .insert({ user_id, contact_id: createProfileResponse.data.id });

  if (createContactResponse.error) throw createContactResponse.error;
};

const getCreateContactMutationOptions = (user_id: string) =>
  mutationOptions({
    mutationFn: (name: string) => createContact({ name, user_id }),
  });

export const useCreateContactMutation = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    ...getCreateContactMutationOptions(session.user.id),
    onSuccess: () => {
      queryClient.invalidateQueries(getContactsQueryOptions(session.user.id));
    },
  });
};
