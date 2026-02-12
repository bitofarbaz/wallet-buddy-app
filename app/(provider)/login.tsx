import { Button, ButtonText } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Header, HeaderTitle } from "@/components/ui/header";
import { KeyboardAwareView } from "@/components/ui/keyboard-aware-view";
import { Text } from "@/components/ui/text";
import { InputGroup, TextInput } from "@/components/ui/text-input";
import { useLoginMutation } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string(),
});
type LoginFormValues = z.infer<typeof LoginFormSchema>;

export default function LoginScreen() {
  const { isPending, mutateAsync: loginAsync, error } = useLoginMutation();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    disabled: isPending,
  });
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Header>
        <HeaderTitle>Wallet Buddy — Lite</HeaderTitle>
      </Header>
      <ScrollView>
        <FieldGroup>
          <Field>
            <Text size="lg" weight="semiBold">
              👋 Welcome back!
            </Text>
            <Text color="mutedForeground">
              Please enter your credentials to login and continue using Wallet
              Buddy!
            </Text>
          </Field>
          <Controller
            control={form.control}
            name="email"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Field>
                <Text>Email</Text>
                <InputGroup>
                  <TextInput
                    placeholder="john.doe@example.com"
                    value={value}
                    onChangeText={onChange}
                  />
                </InputGroup>
                <FieldError error={error?.message} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Field>
                <Text>Password</Text>
                <InputGroup>
                  <TextInput
                    secureTextEntry
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    value={value}
                    onChangeText={onChange}
                  />
                </InputGroup>
                <FieldError error={error?.message} />
              </Field>
            )}
          />
          <Button
            isLoading={isPending}
            onPress={form.handleSubmit(async (formData) => {
              const { email, password } = formData;
              await loginAsync({ email, password });
              router.push("/");
            })}
          >
            <ButtonText>Continue</ButtonText>
          </Button>
          <FieldError
            error={error?.message}
            style={{ marginHorizontal: "auto" }}
          />
          <TouchableOpacity onPress={() => router.navigate("/register")}>
            <Text
              color="mutedForeground"
              size="sm"
              style={{ marginInline: "auto" }}
            >
              Don&apos;t have an account?{" "}
              <Text style={{ textDecorationLine: "underline" }}>
                Register today.
              </Text>
            </Text>
          </TouchableOpacity>
        </FieldGroup>
        <KeyboardAwareView />
      </ScrollView>
    </View>
  );
}
