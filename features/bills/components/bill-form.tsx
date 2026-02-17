import { Badge, BadgeGroup, BadgeText } from "@/components/ui/badge";
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
import { Loader, LoaderIcon, LoaderText } from "@/components/ui/loader";
import { RadioGroup, RadioItem, RadioLabel } from "@/components/ui/radio";
import {
  ScreenDescription,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { Text } from "@/components/ui/text";
import {
  InputGroup,
  InputIcon,
  InputValue,
  TextInput,
} from "@/components/ui/text-input";
import { getShareAmount } from "@/features/bills/utils/get-share-amount";
import { useCategoriesQuery } from "@/features/categories/api/get-categories";
import { useContactsQuery } from "@/features/contacts/api/get-contacts";
import { ListItemProfile } from "@/features/profiles/components/list-item-profile";
import { useArrayToMap } from "@/hooks/use-array-to-map";
import { useProfile } from "@/stores/profile.context";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import {
  createContext,
  FC,
  Fragment,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { useCreateBillMutation } from "../api/create-bill";
import {
  BillFormSchema,
  BillFormValues,
  PaymentStatusSchema,
  SplitMethodSchema,
} from "../config/bill-form-schema";

const useBillFormContext = () => useFormContext<BillFormValues>();

const SelectParticipants: FC = () => {
  const ref = useRef<BottomSheetRef>(null!);

  const profile = useProfile();
  const contactsQuery = useContactsQuery();
  const contactsMap = useArrayToMap(contactsQuery.data || []);
  const form = useBillFormContext();
  const fieldArray = useFieldArray({ control: form.control, name: "shares" });
  const bill = useWatch(form);

  const getLocalizedShareAmount = (user_id: string) =>
    getShareAmount(
      {
        bill_shares: bill.shares!.map((item) => ({
          bill_id: "",
          share_value: item.share_value!,
          user_id: item.user_id!,
        })),
        split_method: bill.split_method!,
        amount_total: bill.amount_total || 0,
      },
      user_id,
    );
  return (
    <>
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
                  onPress={() => {
                    onChange(SplitMethodSchema.enum.equally);
                    fieldArray.fields.forEach((field, idx) =>
                      fieldArray.update(idx, {
                        ...field,
                        share_value: 1,
                      }),
                    );
                  }}
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
                  onPress={() => {
                    onChange(SplitMethodSchema.enum.shares);
                    fieldArray.fields.forEach((field, idx) =>
                      fieldArray.update(idx, {
                        ...field,
                        share_value: 1,
                      }),
                    );
                  }}
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
                  onPress={() => {
                    onChange(SplitMethodSchema.enum.exact_amount);
                    fieldArray.fields.forEach((field, idx) =>
                      fieldArray.update(idx, {
                        ...field,
                        share_value: getLocalizedShareAmount(field.user_id),
                      }),
                    );
                  }}
                >
                  <ButtonText>Exact amount</ButtonText>
                </Button>
              </View>
            </>
          )}
        />
      </Field>
      <Field style={{ flex: 1 }}>
        <FlatList
          data={fieldArray.fields}
          renderItem={({ item, index }) => {
            const user =
              item.user_id === profile.id
                ? profile
                : contactsMap.get(item.user_id);
            if (!user) return <Fragment />;
            const share_amount = getLocalizedShareAmount(item.user_id);
            if (bill.split_method === "exact_amount")
              return (
                <ListItemProfile
                  profile={user}
                  end={
                    <Controller
                      control={form.control}
                      name={`shares.${index}.share_value`}
                      render={({ field: { value, onChange } }) => (
                        <InputGroup style={{ width: 120 }}>
                          <TextInput
                            style={{ flex: 1 }}
                            placeholder="Rs 1,234.56"
                            value={value ? value.toString() : ""}
                            onChangeText={(v) => onChange(parseFloat(v))}
                          />
                        </InputGroup>
                      )}
                    />
                  }
                />
              );
            if (bill.split_method === "shares")
              return (
                <ListItemProfile
                  profile={user}
                  secondaryText={share_amount.toString()}
                  end={
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Button
                        size="icon-sm"
                        onPress={() => {
                          fieldArray.update(index, {
                            ...item,
                            share_value: Math.max(0, item.share_value - 1),
                          });
                        }}
                      >
                        <ButtonIcon name="minus" />
                      </Button>
                      <Text>{item.share_value}</Text>
                      <Button
                        size="icon-sm"
                        onPress={() => {
                          fieldArray.update(index, {
                            ...item,
                            share_value: item.share_value + 1,
                          });
                        }}
                      >
                        <ButtonIcon name="plus" />
                      </Button>
                    </View>
                  }
                />
              );
            return (
              <TouchableOpacity
                onPress={() =>
                  fieldArray.update(index, {
                    ...item,
                    share_value: Math.abs(item.share_value - 1),
                  })
                }
              >
                <ListItemProfile
                  profile={user}
                  selected={item.share_value === 1}
                  end={<Text>{share_amount}</Text>}
                />
              </TouchableOpacity>
            );
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
    </>
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
      render={({ field: { value, onChange }, fieldState: { error } }) => {
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
            <FieldError error={error?.message} />
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
      render={({ field: { value, onChange }, fieldState: { error } }) => (
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
          <FieldError error={error?.message} />
        </Field>
      )}
    />
  );
};

type Step = "basic_information" | "split_bill" | "payment_information";
const StepContext = createContext<{
  step: Step;
  prev: () => void;
  next: () => void;
}>(null!);
const useStepContext = () => useContext(StepContext);

const PaymentInformation: FC = () => {
  const { prev } = useStepContext();
  const form = useBillFormContext();
  const router = useRouter();
  const { mutateAsync: createBillAsync, isPending } = useCreateBillMutation();
  const onSubmit = async (formData: BillFormValues) => {
    await createBillAsync(formData);
    router.dismissTo("/");
  };
  console.debug(form.formState.errors);
  return (
    <>
      <Header>
        <HeaderBackButton onPress={prev} />
      </Header>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <ScreenHeader>
          <Breadcrumb>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Bills</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>New</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbScreen>Payment information</BreadcrumbScreen>
          </Breadcrumb>
          <ScreenTitle>Payment Information</ScreenTitle>
          <ScreenDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem,
            dolorem!
          </ScreenDescription>
        </ScreenHeader>
        <FieldGroup style={{ flex: 1 }}>
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
          <View style={{ flex: 1 }} />
          <Button isLoading={isPending} onPress={form.handleSubmit(onSubmit)}>
            <ButtonText>Create bill</ButtonText>
          </Button>
          <KeyboardAwareView />
        </FieldGroup>
      </ScrollView>
    </>
  );
};

const SplitBill: FC = () => {
  const { prev, next } = useStepContext();
  const form = useBillFormContext();
  return (
    <>
      <Header>
        <HeaderBackButton onPress={prev} />
      </Header>
      <ScreenHeader>
        <Breadcrumb>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Bills</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>New</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbScreen>Split bill</BreadcrumbScreen>
        </Breadcrumb>
        <ScreenTitle>Split Bill</ScreenTitle>
        <ScreenDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem,
          dolorem!
        </ScreenDescription>
      </ScreenHeader>
      <FieldGroup style={{ flex: 1 }}>
        <Field style={{ flex: 1 }}>
          <SelectParticipants />
          <Button
            onPress={async () => {
              const valid = await form.trigger(["shares", "split_method"]);
              if (!valid) return;
              next();
            }}
          >
            <ButtonText>Continue</ButtonText>
          </Button>
        </Field>
        <KeyboardAwareView />
      </FieldGroup>
    </>
  );
};

const BasicInformation: FC = () => {
  const { next } = useStepContext();
  const form = useBillFormContext();
  return (
    <>
      <Header>
        <HeaderBackButton />
      </Header>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader>
          <Breadcrumb>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Bills</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>New</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbScreen>Basic information</BreadcrumbScreen>
          </Breadcrumb>
          <ScreenTitle>Basic Information</ScreenTitle>
          <ScreenDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem,
            dolorem!
          </ScreenDescription>
        </ScreenHeader>
        <FieldGroup style={{ flex: 1 }}>
          <SelectCategory />
          <Controller
            control={form.control}
            name="title"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Field>
                <Label>Title</Label>
                <InputGroup>
                  <InputIcon name="format-letter-case" />
                  <TextInput
                    placeholder="Dine out at ox'n'grills"
                    value={value || ""}
                    onChangeText={onChange}
                  />
                </InputGroup>
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
                    placeholder="Rs 4,500.65"
                    value={value?.toString()}
                    onChangeText={(v) => onChange(parseFloat(v))}
                  />
                </InputGroup>
                <FieldError error={error?.message} />
              </Field>
            )}
          />
          <View style={{ flex: 1 }} />
          <Button
            onPress={async () => {
              const valid = await form.trigger([
                "category_id",
                "title",
                "amount_total",
              ]);
              if (!valid) return;
              console.debug(valid);
              next();
            }}
          >
            <ButtonText>Continue</ButtonText>
          </Button>
          <KeyboardAwareView />
        </FieldGroup>
      </ScrollView>
    </>
  );
};

const steps: Step[] = [
  "basic_information",
  "split_bill",
  "payment_information",
];
export const BillForm: FC = () => {
  const [step, setStep] = useState<Step>("basic_information");

  const next = () =>
    setStep((pv) => steps[Math.min(steps.length - 1, steps.indexOf(step) + 1)]);
  const prev = () =>
    setStep((pv) => steps[Math.max(0, steps.indexOf(step) - 1)]);

  const profile = useProfile();
  const contactsQuery = useContactsQuery();
  const categoriesQuery = useCategoriesQuery();

  const form = useForm<BillFormValues>({
    resolver: zodResolver(BillFormSchema),
    defaultValues: {
      paid_by_id: profile.id,
      invoiced_at: new Date(),
      split_method: SplitMethodSchema.enum.equally,
      shares: [{ share_value: 1, user_id: profile.id }],
      payment_status: PaymentStatusSchema.enum.paid_same_day,
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
      <StepContext.Provider value={{ next, prev, step }}>
        {step === "basic_information" && <BasicInformation />}
        {step === "split_bill" && <SplitBill />}
        {step === "payment_information" && <PaymentInformation />}
      </StepContext.Provider>
    </FormProvider>
  );
};
