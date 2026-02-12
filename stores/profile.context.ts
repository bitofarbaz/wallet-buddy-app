import { Profile } from "@/types/api";
import { createContext, useContext } from "react";

export const ProfileContext = createContext<Profile | null>(null);
export const useProfileContext = () => useContext(ProfileContext);
export const useProfile = () => {
  const ctx = useProfileContext();
  if (!ctx) throw new Error();
  return ctx;
};
