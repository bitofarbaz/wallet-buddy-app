import { z } from "zod";
const createEnv = () => {
  const schema = z.object({
    EXPO_PUBLIC_SUPABASE_URL: z.string(),
    EXPO_PUBLIC_SUPABASE_KEY: z.string(),
  });
  return schema.parse(process.env);
};

export const env = createEnv();
