import { supabase } from "@/lib/supabase";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getProfile = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;

  return data;
};

const getProfileQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["profiles", { id }],
    queryFn: () => getProfile(id),
  });

export const useProfileQuery = (id: string) =>
  useQuery(getProfileQueryOptions(id));
