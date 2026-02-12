import { FC } from "react";
import { Text, TextProps } from "./text";

export const Label: FC<TextProps> = (props) => (
  <Text size="sm" weight="medium" {...props} />
);
