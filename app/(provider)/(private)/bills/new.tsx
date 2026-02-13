import { Badge, BadgeGroup, BadgeText } from "@/components/ui/badge";
import {
  BottomSheet,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetRef,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Header, HeaderBackButton, HeaderTitle } from "@/components/ui/header";
import { KeyboardAwareView } from "@/components/ui/keyboard-aware-view";
import { Label } from "@/components/ui/label";
import { Loader, LoaderIcon, LoaderText } from "@/components/ui/loader";
import { RadioGroup, RadioItem, RadioLabel } from "@/components/ui/radio";
import {
  InputGroup,
  InputIcon,
  InputValue,
  TextInput,
} from "@/components/ui/text-input";
import { useCategoriesQuery } from "@/features/categories/api/get-categories";
import { useContactsQuery } from "@/features/contacts/api/get-contacts";
import { ListItemProfile } from "@/features/profiles/components/list-item-profile";
import { useArrayToMap } from "@/hooks/use-array-to-map";
import { useProfile } from "@/stores/profile.context";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { FC, Fragment, useRef } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const SplitMethodSchema = z.enum(["equally", "shares", "exact_amount"]);
const PaymentStatusSchema = z.enum([
  "paid_same_day",
  "paid_different_day",
  "unpaid",
]);

const BillFormSchema = z
  .object({
    category_id: z.string(),
    title: z.string().nullish(),
    invoiced_at: z.date(),
    due_at: z.date(),
    split_method: SplitMethodSchema,
    amount_total: z.number().gt(0),
    shares: z.array(
      z.object({
        user_id: z.string(),
        share_value: z.number(),
      }),
    ),
  })
  .and(
    z.discriminatedUnion("payment_status", [
      z.object({
        payment_status: z.literal(PaymentStatusSchema.enum.paid_same_day),
        paid_by_id: z.string(),
      }),
      z.object({
        payment_status: z.literal(PaymentStatusSchema.enum.paid_different_day),
        paid_at: z.date(),
        paid_by_id: z.string(),
      }),
      z.object({
        payment_status: z.literal(PaymentStatusSchema.enum.unpaid),
      }),
    ]),
  );

type BillFormValues = z.infer<typeof BillFormSchema>;

const useBillFormContext = () => useFormContext<BillFormValues>();

const SelectParticipants: FC = () => {
  const ref = useRef<BottomSheetRef>(null!);

  const profile = useProfile();
  const contactsQuery = useContactsQuery();
  const contactsMap = useArrayToMap(contactsQuery.data || []);
  const form = useBillFormContext();
  const fieldArray = useFieldArray({ control: form.control, name: "shares" });
  return (
    <Field>
      <FlatList
        data={fieldArray.fields}
        renderItem={({ item }) => {
          const user =
            item.user_id === profile.id
              ? profile
              : contactsMap.get(item.user_id);
          if (!user) return <Fragment />;
          return <ListItemProfile profile={user} />;
        }}
      />
      <Button variant="secondary" onPress={() => ref.current.expand()}>
        <ButtonIcon name="account-multiple-plus" />
        <ButtonText>Select participant</ButtonText>
      </Button>
      <BottomSheet ref={ref}>
        <BottomSheetView style={{ gap: 24, paddingBlock: 16 }}>
          <BottomSheetHeader>
            <BottomSheetTitle>Select participants</BottomSheetTitle>
            <BottomSheetDescription>
              Select people you&apos;d like to split this bill with.
            </BottomSheetDescription>
          </BottomSheetHeader>
          <FlatList
            data={contactsQuery.data || []}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item: contact }) => {
              const idx = fieldArray.fields.findIndex(
                (item) => item.user_id === contact.id,
              );
              const selected = idx >= 0;
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (selected) fieldArray.remove(idx);
                    else
                      fieldArray.append({
                        share_value: 1,
                        user_id: contact.id,
                      });
                  }}
                >
                  <ListItemProfile profile={contact} selected={selected} />
                </TouchableOpacity>
              );
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </Field>
  );
};

const SelectCategory: FC = () => {
  const categoriesQuery = useCategoriesQuery();
  const form = useBillFormContext();

  return (
    <Controller
      control={form.control}
      name="category_id"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field>
          <Label>Category</Label>
          <BadgeGroup>
            {categoriesQuery.data?.map((item) => (
              <Badge
                key={item.id}
                variant={value === item.id ? "default" : "secondary"}
                onPress={() => onChange(item.id)}
              >
                <BadgeText>{item.icon}</BadgeText>
                <BadgeText>{item.label}</BadgeText>
              </Badge>
            ))}
          </BadgeGroup>
          <FieldError error={error?.message} />
        </Field>
      )}
    />
  );
};

const SelectPayee: FC = () => {
  const ref = useRef<BottomSheetRef>(null!);
  const form = useBillFormContext();
  const contactsQuery = useContactsQuery();
  const profile = useProfile();
  const contactsMap = useArrayToMap(contactsQuery.data || []);

  const { payment_status } = useWatch(form);
  if (payment_status === "unpaid") return <></>;

  return (
    <Controller
      name="paid_by_id"
      control={form.control}
      render={({ field: { value, onChange } }) => {
        const user = value === profile.id ? profile : contactsMap.get(value);
        return (
          <Field>
            <Label>Who paid?</Label>
            <TouchableOpacity onPress={() => ref.current.expand()}>
              <InputGroup>
                <InputIcon name="account-cash" />
                <InputValue placeholder="Select payee">
                  {user ? user.name : false}
                </InputValue>
                <InputIcon name="chevron-down" />
              </InputGroup>
            </TouchableOpacity>
            <BottomSheet ref={ref}>
              <BottomSheetView>
                <BottomSheetHeader>
                  <BottomSheetTitle>Select payee</BottomSheetTitle>
                  <BottomSheetDescription>
                    Select participant who paid for the bill
                  </BottomSheetDescription>
                </BottomSheetHeader>
                <FlatList
                  contentContainerStyle={{ padding: 16 }}
                  data={[profile, ...(contactsQuery.data || [])]}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        onChange(item.id);
                        ref.current.close();
                      }}
                    >
                      <ListItemProfile
                        profile={item}
                        selected={value === item.id}
                      />
                    </TouchableOpacity>
                  )}
                />
              </BottomSheetView>
            </BottomSheet>
          </Field>
        );
      }}
    />
  );
};

const SelectPaymentDate: FC = () => {
  const form = useBillFormContext();
  const { payment_status } = useWatch(form);
  if (payment_status !== "paid_different_day") return <></>;
  return (
    <Controller
      control={form.control}
      name="paid_at"
      render={({ field: { value, onChange } }) => (
        <Field>
          <Label>Payment date</Label>
          <TouchableOpacity
            onPress={() =>
              DateTimePickerAndroid.open({
                value: value || new Date(),
                onChange: (_, date) => onChange(date),
              })
            }
          >
            <InputGroup>
              <InputIcon name="calendar-today" />
              <InputValue placeholder="Select date">
                {value ? format(value, "do MMMM, yyyy") : false}
              </InputValue>
              <InputIcon name="chevron-down" />
            </InputGroup>
          </TouchableOpacity>
        </Field>
      )}
    />
  );
};

export default function NewBillScreen() {
  const profile = useProfile();
  const contactsQuery = useContactsQuery();
  const categoriesQuery = useCategoriesQuery();

  const form = useForm<BillFormValues>({
    resolver: zodResolver(BillFormSchema),
    defaultValues: {
      invoiced_at: new Date(),
      split_method: SplitMethodSchema.enum.equally,
      shares: [{ share_value: 1, user_id: profile.id }],
    },
  });

  if (categoriesQuery.isLoading || contactsQuery.isLoading)
    return (
      <Loader>
        <LoaderIcon />
        <LoaderText>Fetching categories and contacts...</LoaderText>
      </Loader>
    );

  return (
    <FormProvider {...form}>
      <Header>
        <HeaderBackButton />
        <HeaderTitle>New Bill — Basic Information</HeaderTitle>
      </Header>
      <ScrollView keyboardShouldPersistTaps="handled">
        <FieldGroup>
          <SelectCategory />
          <Field>
            <Label>Title (optional)</Label>
            <InputGroup>
              <InputIcon name="format-letter-case" />
              <TextInput placeholder="Dine out at ox'n'grills" />
            </InputGroup>
          </Field>
          <Field>
            <Label>Amount</Label>
            <InputGroup>
              <InputIcon name="currency-usd" />
              <TextInput placeholder="Rs 4,500.65" />
            </InputGroup>
          </Field>
          <Controller
            control={form.control}
            name="invoiced_at"
            render={({ field: { value, onChange } }) => (
              <Field>
                <Label>Invoice date</Label>
                <TouchableOpacity
                  onPress={() =>
                    DateTimePickerAndroid.open({
                      value: value || new Date(),
                      onChange: (_, date) => onChange(date),
                    })
                  }
                >
                  <InputGroup>
                    <InputIcon name="calendar" />
                    <InputValue placeholder="Select date">
                      {value ? format(value, "do MMMM, yyyy") : false}
                    </InputValue>
                    <InputIcon name="chevron-down" />
                  </InputGroup>
                </TouchableOpacity>
              </Field>
            )}
          />
          <Controller
            name="payment_status"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <Field>
                <Label>Payment status</Label>
                <RadioGroup value={value} onChange={onChange}>
                  <RadioItem value={PaymentStatusSchema.enum.paid_same_day}>
                    <RadioLabel>Paid, same day as invoice</RadioLabel>
                  </RadioItem>
                  <RadioItem
                    value={PaymentStatusSchema.enum.paid_different_day}
                  >
                    <RadioLabel>Paid, but on a different date</RadioLabel>
                  </RadioItem>
                  <RadioItem value={PaymentStatusSchema.enum.unpaid}>
                    <RadioLabel>Not yet paid</RadioLabel>
                  </RadioItem>
                </RadioGroup>
              </Field>
            )}
          />
          <SelectPayee />
          <SelectPaymentDate />
          <Controller
            control={form.control}
            name="due_at"
            render={({ field: { value, onChange } }) => (
              <Field>
                <Label>Due date (optional)</Label>
                <TouchableOpacity
                  onPress={() =>
                    DateTimePickerAndroid.open({
                      value: value || new Date(),
                      onChange: (_, date) => onChange(date),
                    })
                  }
                >
                  <InputGroup>
                    <InputIcon name="calendar-alert" />
                    <InputValue placeholder="Select date">
                      {value ? format(value, "do MMMM, yyyy") : false}
                    </InputValue>
                    <InputIcon name="chevron-down" />
                  </InputGroup>
                </TouchableOpacity>
              </Field>
            )}
          />
          <Field>
            <Controller
              control={form.control}
              name="split_method"
              render={({ field: { value, onChange } }) => (
                <>
                  <Label>Split method</Label>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Button
                      size="sm"
                      variant={
                        value === SplitMethodSchema.enum.equally
                          ? "default"
                          : "secondary"
                      }
                      onPress={() => onChange(SplitMethodSchema.enum.equally)}
                    >
                      <ButtonText>Equally</ButtonText>
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        value === SplitMethodSchema.enum.shares
                          ? "default"
                          : "secondary"
                      }
                      onPress={() => onChange(SplitMethodSchema.enum.shares)}
                    >
                      <ButtonText>Shares</ButtonText>
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        value === SplitMethodSchema.enum.exact_amount
                          ? "default"
                          : "secondary"
                      }
                      onPress={() =>
                        onChange(SplitMethodSchema.enum.exact_amount)
                      }
                    >
                      <ButtonText>Exact amount</ButtonText>
                    </Button>
                  </View>
                </>
              )}
            />
            <SelectParticipants />
            <Button>
              <ButtonText>Continue</ButtonText>
            </Button>
          </Field>
        </FieldGroup>
        <KeyboardAwareView />
      </ScrollView>
    </FormProvider>
  );
}
