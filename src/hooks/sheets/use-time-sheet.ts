"use client";

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function useTimeSheetParams() {
  const [params, setParams] = useQueryStates({
    timeCreate: parseAsBoolean,
    timeDelete: parseAsString,
  });
  return { ...params, setParams };
}
