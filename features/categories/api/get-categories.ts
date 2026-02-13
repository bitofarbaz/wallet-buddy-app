import { supabase } from "@/lib/supabase";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) throw error;
  return data;
};

const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: getCategories,
});

export const useCategoriesQuery = () => useQuery(categoriesQueryOptions);
