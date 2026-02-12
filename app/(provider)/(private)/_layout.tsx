import { Stack } from "@/components/ui/stack";
import { useSessionContext } from "@/stores/session.context";
import { Redirect } from "expo-router";

export default function PrivateLayout() {
  const session = useSessionContext();
  if (!session) return <Redirect href={"/login"} />;
  return <Stack />;
}
