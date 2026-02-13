import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Header,
  HeaderActions,
  HeaderBackButton,
  HeaderTitle,
} from "@/components/ui/header";
import { Label } from "@/components/ui/label";
import { Text, textVariants } from "@/components/ui/text";
import { InputGroup } from "@/components/ui/text-input";
import { useCreateContactMutation } from "@/features/contacts/api/create-contact";
import { useContactsQuery } from "@/features/contacts/api/get-contacts";
import { useTheme } from "@/hooks/use-theme";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  Image,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string(),
});
type CreateContactFormValues = z.infer<typeof ContactFormSchema>;

export default function ContactsScreen() {
  const ref = useRef<BottomSheet>(null!);
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
        <HeaderTitle>Contacts</HeaderTitle>
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
      <FlatList
        data={contactsQuery.data || []}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              paddingBlock: 8,
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                overflow: "hidden",
                borderRadius: theme.radius,
                backgroundColor: theme.secondary,
              }}
            >
              <Image
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                source={{
                  uri: `https://api.dicebear.com/9.x/initials/png?seed=${item.name}`,
                }}
              />
            </View>
            <View>
              <Text weight="semiBold">{item.name}</Text>
              <Text color="mutedForeground">#{item.id.slice(-4)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Portal>
        <BottomSheet
          ref={ref}
          detached
          bottomInset={48}
          enableDynamicSizing
          enablePanDownToClose
          keyboardBlurBehavior="restore"
          keyboardBehavior="interactive"
          onClose={() => {
            Keyboard.dismiss();
            form.reset();
          }}
          containerStyle={{ marginHorizontal: 16 }}
          handleIndicatorStyle={{ backgroundColor: theme.mutedForeground }}
          handleStyle={{
            backgroundColor: theme.card,
            borderTopLeftRadius: theme.radius,
            borderTopRightRadius: theme.radius,
          }}
          backgroundStyle={{
            backgroundColor: theme.card,
            borderTopLeftRadius: theme.radius,
            borderTopRightRadius: theme.radius,
          }}
          index={-1}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              {...props}
            />
          )}
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
        </BottomSheet>
      </Portal>
    </>
  );
}
