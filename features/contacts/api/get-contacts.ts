import { supabase } from "@/lib/supabase";
import { useSession } from "@/stores/session.context";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getContacts = async (user_id: string) => {
  const getContactsResponse = await supabase
    .from("contacts")
    .select("user:profiles!user_id(*), contact:profiles!contact_id(*)")
    .or(`user_id.eq.${user_id},contact_id.eq.${user_id}`);
  if (getContactsResponse.error) throw getContactsResponse.error;
  return getContactsResponse.data
    .flatMap((row) => [row.user, row.contact])
    .filter((item) => item.id !== user_id);
};

export const getContactsQueryOptions = (user_id: string) =>
  queryOptions({ queryKey: ["contacts"], queryFn: () => getContacts(user_id) });

export const useContactsQuery = () => {
  const session = useSession();
  return useQuery(getContactsQueryOptions(session.user.id));
};
