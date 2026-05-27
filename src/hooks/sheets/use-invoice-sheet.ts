"use client";

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function useInvoiceSheetParams() {
  const [params, setParams] = useQueryStates({
    invoiceCreate: parseAsBoolean,
    invoiceDelete: parseAsString,
  });
  return { ...params, setParams };
}
