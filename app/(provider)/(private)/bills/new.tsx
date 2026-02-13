import { Button, ButtonText } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Header, HeaderBackButton, HeaderTitle } from "@/components/ui/header";
import { Label } from "@/components/ui/label";
import { Loader, LoaderIcon, LoaderText } from "@/components/ui/loader";
import {
  InputGroup,
  InputIcon,
  InputValue,
  TextInput,
} from "@/components/ui/text-input";
import { useCategoriesQuery } from "@/features/categories/api/get-categories";
import { useContactsQuery } from "@/features/contacts/api/get-contacts";
import { ScrollView, View } from "react-native";

export default function NewBillScreen() {
  const categoriesQuery = useCategoriesQuery();
  const contactsQuery = useContactsQuery();
  console.debug(categoriesQuery, contactsQuery);
  if (categoriesQuery.isLoading || contactsQuery.isLoading)
    return (
      <Loader>
        <LoaderIcon />
        <LoaderText>Fetching categories and contacts...</LoaderText>
      </Loader>
    );
  return (
    <View>
      <Header>
        <HeaderBackButton />
        <HeaderTitle>New Bill — Basic Information</HeaderTitle>
      </Header>
      <ScrollView keyboardShouldPersistTaps="handled">
        <FieldGroup>
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
          <Field>
            <Label>Participants</Label>
            <InputGroup>
              <InputIcon name="account-group" />
              <TextInput placeholder="Select participants" />
              <InputIcon name="chevron-down" />
            </InputGroup>
          </Field>
          <Field>
            <Label>Invoice date</Label>
            <InputGroup>
              <InputIcon name="calendar" />
              <TextInput placeholder="Select participants" />
              <InputIcon name="chevron-down" />
            </InputGroup>
          </Field>
          <Field>
            <Label>Due date</Label>
            <InputGroup>
              <InputIcon name="calendar-alert" />
              <InputValue placeholder="Select participants">{false}</InputValue>
              <InputIcon name="chevron-down" />
            </InputGroup>
          </Field>
          <Field>
            <Label>Split method</Label>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button size="sm">
                <ButtonText>Equally</ButtonText>
              </Button>
              <Button size="sm" variant="secondary">
                <ButtonText>Shares</ButtonText>
              </Button>
              <Button size="sm" variant="secondary">
                <ButtonText>Exact amount</ButtonText>
              </Button>
            </View>
          </Field>
        </FieldGroup>
      </ScrollView>
    </View>
  );
}
