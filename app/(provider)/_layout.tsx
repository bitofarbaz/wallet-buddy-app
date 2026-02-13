import { Loader, LoaderIcon, LoaderText } from "@/components/ui/loader";
import { Stack } from "@/components/ui/stack";
import { useProfileQuery } from "@/features/profiles/api/get-profile";
import { supabase } from "@/lib/supabase";
import { ProfileContext } from "@/stores/profile.context";
import { SessionContext, useSession } from "@/stores/session.context";
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
  Geist_900Black,
  useFonts,
} from "@expo-google-fonts/geist";
import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { FC, PropsWithChildren, useEffect, useState } from "react";

const queryClient = new QueryClient();

const ProfileProvider: FC<PropsWithChildren> = ({ children }) => {
  const session = useSession();
  const { data, isLoading } = useProfileQuery(session.user.id);
  if (isLoading)
    return (
      <Loader>
        <LoaderIcon />
        <LoaderText>Fetching profile...</LoaderText>
      </Loader>
    );
  return (
    <ProfileContext.Provider value={data || null}>
      {children}
    </ProfileContext.Provider>
  );
};

const FontLoader: FC<PropsWithChildren> = ({ children }) => {
  SplashScreen.preventAutoHideAsync();

  const [loaded, error] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    Geist_900Black,
  });

  if (!loaded && !error) {
    return (
      <Loader>
        <LoaderIcon />
        <LoaderText>Loading fonts...</LoaderText>
      </Loader>
    );
  }

  return children;
};

export default function ProviderLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const {
      data: {
        subscription: { unsubscribe },
      },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoading(false);
      setSession(session);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  if (isLoading)
    return (
      <Loader>
        <LoaderIcon />
        <LoaderText>Checking login state...</LoaderText>
      </Loader>
    );
  return (
    <FontLoader>
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={session}>
          {session?.user.id ? (
            <ProfileProvider>
              <Stack />
            </ProfileProvider>
          ) : (
            <Stack />
          )}
        </SessionContext.Provider>
      </QueryClientProvider>
    </FontLoader>
  );
}
