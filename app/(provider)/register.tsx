import { Button, ButtonText } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Header, HeaderBackButton, HeaderTitle } from "@/components/ui/header";
import { KeyboardAwareView } from "@/components/ui/keyboard-aware-view";
import { Text } from "@/components/ui/text";
import { InputGroup, TextInput } from "@/components/ui/text-input";
import { useRegisterMutation } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const RegisterFormSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});
type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export default function RegisterScreen() {
  const {
    isPending,
    mutateAsync: registerAsync,
    error,
  } = useRegisterMutation();
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    disabled: isPending,
  });
  return (
    <View style={{ flex: 1 }}>
      <Header>
        <HeaderBackButton />
        <HeaderTitle>Wallet Buddy — Lite</HeaderTitle>
      </Header>
      <ScrollView keyboardShouldPersistTaps="handled">
        <FieldGroup>
          <Field>
            <Text size="lg" weight="semiBold">
              🥳 Create an account!
            </Text>
            <Text color="mutedForeground">
              Please provide the following details to start using Wallet Buddy!
            </Text>
          </Field>
          <Controller
            control={form.control}
            name="name"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Field>
                <Text>Name</Text>
                <InputGroup>
                  <TextInput
                    placeholder="Arbaz Ajaz"
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
            onPress={form.handleSubmit(async (formData) => {
              const { name, email, password } = formData;
              await registerAsync({ name, email, password });
              router.navigate("/");
            })}
          >
            <ButtonText>Create account</ButtonText>
          </Button>
          <FieldError
            error={error?.message}
            style={{ marginHorizontal: "auto" }}
          />
          <TouchableOpacity onPress={() => router.navigate("/login")}>
            <Text
              color="mutedForeground"
              size="sm"
              style={{ marginInline: "auto" }}
            >
              Already have an account?{" "}
              <Text style={{ textDecorationLine: "underline" }}>
                Login here.
              </Text>
            </Text>
          </TouchableOpacity>
        </FieldGroup>
        <KeyboardAwareView />
      </ScrollView>
    </View>
  );
}
