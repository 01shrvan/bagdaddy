"use client";

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function useTimeSheetParams() {
  const [params, setParams] = useQueryStates({
    timeCreate: parseAsBoolean,
    timeEdit: parseAsString,
    timeDelete: parseAsString,
  });
  return { ...params, setParams };
}
