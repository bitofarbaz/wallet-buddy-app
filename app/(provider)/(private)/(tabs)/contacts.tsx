import {
  BottomSheetRef,
  DetachedBottomSheet,
} from "@/components/ui/bottom-sheet";
import {
  Breadcrumb,
  BreadcrumbScreen,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Header,
  HeaderActions,
  HeaderBackButton,
} from "@/components/ui/header";
import { Label } from "@/components/ui/label";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { Text, textVariants } from "@/components/ui/text";
import { InputGroup } from "@/components/ui/text-input";
import { useCreateContactMutation } from "@/features/contacts/api/create-contact";
import { useContactsQuery } from "@/features/contacts/api/get-contacts";
import { ListItemProfile } from "@/features/profiles/components/list-item-profile";
import { useTheme } from "@/hooks/use-theme";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlatList, Keyboard, View } from "react-native";
import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string(),
});
type CreateContactFormValues = z.infer<typeof ContactFormSchema>;

export default function ContactsScreen() {
  const ref = useRef<BottomSheetRef>(null!);
  const theme = useTheme();
  const contactsQuery = useContactsQuery();
  const { mutateAsync: createContactAsync, isPending } =
    useCreateContactMutation();
  const form = useForm<CreateContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
  });
  return (
    <>
      <Header>
        <HeaderBackButton />
        {/* <HeaderTitle>Contacts</HeaderTitle> */}
        <HeaderActions>
          <Button
            size="icon"
            variant="secondary"
            onPress={() => ref.current.expand()}
          >
            <ButtonIcon name="account-plus" />
          </Button>
        </HeaderActions>
      </Header>
      <ScreenHeader>
        <Breadcrumb>
          <BreadcrumbSeparator />
          <BreadcrumbScreen>Contacts</BreadcrumbScreen>
        </Breadcrumb>
        <ScreenTitle>Contacts</ScreenTitle>
        <ScreenDescription>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, quam.
        </ScreenDescription>
      </ScreenHeader>
      <FlatList
        data={contactsQuery.data || []}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ListItemProfile profile={item} />}
        ListFooterComponentStyle={{ marginTop: 24 }}
        ListFooterComponent={() => (
          <Button variant="secondary" onPress={() => ref.current.expand()}>
            <ButtonIcon name="account-plus" />
            <ButtonText>Create contact</ButtonText>
          </Button>
        )}
      />
      <Portal>
        <DetachedBottomSheet
          ref={ref}
          onClose={() => {
            Keyboard.dismiss();
            form.reset();
          }}
        >
          <BottomSheetView>
            <FieldGroup>
              <View style={{ gap: 8 }}>
                <Text size="lg" weight="semiBold">
                  Create contact
                </Text>
                <Text color="mutedForeground">
                  Tracking doesn&apos;t have to stop even if your friend is not
                  on the platform.
                </Text>
              </View>
              <Controller
                control={form.control}
                name="name"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Field>
                    <Label>Name</Label>
                    <InputGroup>
                      <BottomSheetTextInput
                        placeholderTextColor={theme.mutedForeground}
                        style={textVariants(theme)({ style: { flex: 1 } })}
                        placeholder="John Doe"
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
                  await createContactAsync(formData.name);
                  ref.current.close();
                })}
              >
                <ButtonText>Save</ButtonText>
              </Button>
            </FieldGroup>
          </BottomSheetView>
        </DetachedBottomSheet>
      </Portal>
    </>
  );
}
