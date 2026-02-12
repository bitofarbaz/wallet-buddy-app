import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "./supabase";

// #region LOGIN

interface LoginDTO {
  email: string;
  password: string;
}
const login = async (variables: LoginDTO) => {
  const { email, password } = variables;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  console.debug(data);
  return data;
};

const loginMutationOptions = mutationOptions({ mutationFn: login });

export const useLoginMutation = () => useMutation(loginMutationOptions);

// #region LOGOUT

const logout = () => supabase.auth.signOut();
const logoutMutationOptions = mutationOptions({ mutationFn: logout });
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    ...logoutMutationOptions,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// #region REGISTER

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}
const register = async (variables: RegisterDTO) => {
  const { name, email, password } = variables;
  const signUpResponse = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpResponse.error) throw signUpResponse.error;
  if (!signUpResponse.data.session) throw new Error();

  const id = signUpResponse.data.session.user.id;
  const createProfileResponse = await supabase
    .from("profiles")
    .insert({ id, name })
    .select("*")
    .single();
  if (createProfileResponse.error) throw createProfileResponse.error;
  if (!createProfileResponse.data) throw new Error();

  return signUpResponse.data.session;
};

const registerMutationOptions = mutationOptions({ mutationFn: register });

export const useRegisterMutation = () => useMutation(registerMutationOptions);
