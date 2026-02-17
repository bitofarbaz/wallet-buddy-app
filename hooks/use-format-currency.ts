import { useMemo } from "react";

export const useFormatCurrency = () => {
  const { format } = useMemo(
    () =>
      new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
      }),
    [],
  );

  return format;
};
