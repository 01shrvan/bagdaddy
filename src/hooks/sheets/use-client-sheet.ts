"use client";

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function useClientSheetParams() {
  const [params, setParams] = useQueryStates({
    clientCreate: parseAsBoolean,
    clientEdit: parseAsString,
    clientDelete: parseAsString,
  });
  return { ...params, setParams };
}
