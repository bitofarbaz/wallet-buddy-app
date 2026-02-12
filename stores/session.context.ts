import { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export const SessionContext = createContext<Session | null>(null);

export const useSessionContext = () => useContext(SessionContext);
export const useSession = () => {
  const ctx = useSessionContext();
  if (!ctx) throw new Error();
  return ctx;
};
