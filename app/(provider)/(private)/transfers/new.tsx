import {
  BottomSheet,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetRef,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbScreen,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Header, HeaderBackButton } from "@/components/ui/header";
import { KeyboardAwareView } from "@/components/ui/keyboard-aware-view";
import { Label } from "@/components/ui/label";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import {
  InputGroup,
  InputIcon,
  InputValue,
  TextInput,
} from "@/components/ui/text-input";
import { useContactsQuery } from "@/features/contacts/api/get-contacts";
import { ListItemProfile } from "@/features/profiles/components/list-item-profile";
import { useCreateTransferMutation } from "@/features/transfers/api/create-transfer";
import {
  TransferFormSchema,
  TransferFormValues,
  TransferTypeSchema,
} from "@/features/transfers/config/create-transfer-schema";
import { useArrayToMap } from "@/hooks/use-array-to-map";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { FC, useRef } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";

const useTransferFormContext = () => useFormContext<TransferFormValues>();

const SelectContact: FC = () => {
  const ref = useRef<BottomSheetRef>(null!);
  const form = useTransferFormContext();
  const contactsQuery = useContactsQuery();
  const contactsMap = useArrayToMap(contactsQuery.data || []);
  return (
    <Controller
      control={form.control}
      name="contact_id"
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const contact = contactsMap.get(value);
        return (
          <>
            <Field>
              <Label>Contact</Label>
              <TouchableOpacity onPress={() => ref.current.expand()}>
                <InputGroup>
                  <InputIcon name="account" />
                  <InputValue placeholder="Select contact">
                    {contact ? contact.name : false}
                  </InputValue>
                  <InputIcon name="chevron-down" />
                </InputGroup>
              </TouchableOpacity>
              <FieldError error={error?.message} />
            </Field>
            <BottomSheet ref={ref}>
              <BottomSheetView style={{ gap: 24, paddingBlock: 16 }}>
                <BottomSheetHeader>
                  <BottomSheetTitle>Select contact</BottomSheetTitle>
                  <BottomSheetDescription>
                    Select contact you&apos;re recording this transfer with.
                  </BottomSheetDescription>
                </BottomSheetHeader>
                <FlatList
                  data={contactsQuery.data || []}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  renderItem={({ item: contact }) => {
                    const selected = value === contact.id;
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          onChange(contact.id);
                        }}
                      >
                        <ListItemProfile
                          profile={contact}
                          selected={selected}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </BottomSheetView>
            </BottomSheet>
          </>
        );
      }}
    />
  );
};

export default function NewTransferScreen() {
  const router = useRouter();
  const { mutateAsync: createTransferAsync, isPending } =
    useCreateTransferMutation();
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(TransferFormSchema),
    defaultValues: {
      transferred_at: new Date(),
      type: TransferTypeSchema.enum.sent,
    },
  });
  const onSubmit = async (formData: TransferFormValues) => {
    await createTransferAsync(formData);
    router.dismissTo("/");
  };

  return (
    <FormProvider {...form}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Header>
          <HeaderBackButton />
        </Header>
        <ScreenHeader>
          <Breadcrumb>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Transfers</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbScreen>New</BreadcrumbScreen>
          </Breadcrumb>
          <ScreenTitle>New Transfer</ScreenTitle>
          <ScreenDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem,
            voluptatum?
          </ScreenDescription>
        </ScreenHeader>
        <FieldGroup>
          <SelectContact />
          <Controller
            control={form.control}
            name="type"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Field>
                <Label>Type</Label>
                <View style={{ gap: 8, flexDirection: "row" }}>
                  <Button
                    size="sm"
                    variant={value === "sent" ? "default" : "secondary"}
                    onPress={() => onChange(TransferTypeSchema.enum.sent)}
                  >
                    <ButtonIcon name="call-made" />
                    <ButtonText>Sent</ButtonText>
                  </Button>
                  <Button
                    size="sm"
                    variant={value === "received" ? "default" : "secondary"}
                    onPress={() => onChange(TransferTypeSchema.enum.received)}
                  >
                    <ButtonIcon name="call-received" />
                    <ButtonText>Received</ButtonText>
                  </Button>
                </View>
                <FieldError error={error?.message} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="amount_total"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Field>
                <Label>Amount</Label>
                <InputGroup>
                  <InputIcon name="currency-usd" />
                  <TextInput
                    placeholder="Rs 1,234.56"
                    inputMode="decimal"
                    value={value ? value.toString() : ""}
                    onChangeText={(val) => onChange(parseFloat(val))}
                  />
                </InputGroup>
                <FieldError error={error?.message} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="transferred_at"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Field>
                <Label>Date</Label>
                <TouchableOpacity
                  onPress={() => {
                    DateTimePickerAndroid.open({
                      value: value || new Date(),
                      onChange: (_, date) => onChange(date),
                    });
                  }}
                >
                  <InputGroup>
                    <InputIcon name="calendar-today" />
                    <InputValue placeholder="Select date">
                      {value ? format(value, "do MMMM, yyyy") : false}
                    </InputValue>
                    <InputIcon name="chevron-down" />
                  </InputGroup>
                </TouchableOpacity>
                <FieldError error={error?.message} />
              </Field>
            )}
          />
          <Button isLoading={isPending} onPress={form.handleSubmit(onSubmit)}>
            <ButtonText>Save</ButtonText>
          </Button>
          <KeyboardAwareView />
        </FieldGroup>
      </ScrollView>
    </FormProvider>
  );
}
