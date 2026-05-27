"use client";

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function useProjectSheetParams() {
  const [params, setParams] = useQueryStates({
    projectCreate: parseAsBoolean,
    projectEdit: parseAsString,
    projectDelete: parseAsString,
  });
  return { ...params, setParams };
}
