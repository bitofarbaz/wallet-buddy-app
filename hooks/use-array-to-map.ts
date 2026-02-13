import { useMemo } from "react";

export const useArrayToMap = <T extends { id: string }>(arr: T[]) =>
  useMemo(() => new Map(arr.map((item) => [item.id, item])), [arr]);
