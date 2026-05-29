"use client";

import { ClientCreateSheet } from "@/components/sheets/clients/client-create.sheet";
import { ClientEditSheet } from "@/components/sheets/clients/client-edit.sheet";
import { ClientDeleteSheet } from "@/components/sheets/clients/client-delete.sheet";
import { ProjectCreateSheet } from "@/components/sheets/projects/project-create.sheet";
import { ProjectEditSheet } from "@/components/sheets/projects/project-edit.sheet";
import { ProjectDeleteSheet } from "@/components/sheets/projects/project-delete.sheet";
import { TimeCreateSheet } from "@/components/sheets/time/time-create.sheet";
import { TimeEditSheet } from "@/components/sheets/time/time-edit.sheet";
import { TimeDeleteSheet } from "@/components/sheets/time/time-delete.sheet";
import { InvoiceCreateSheet } from "@/components/sheets/invoices/invoice-create.sheet";
import { InvoiceDeleteSheet } from "@/components/sheets/invoices/invoice-delete.sheet";

export function GlobalSheets() {
  return (
    <>
      <ClientCreateSheet />
      <ClientEditSheet />
      <ClientDeleteSheet />
      <ProjectCreateSheet />
      <ProjectEditSheet />
      <ProjectDeleteSheet />
      <TimeCreateSheet />
      <TimeEditSheet />
      <TimeDeleteSheet />
      <InvoiceCreateSheet />
      <InvoiceDeleteSheet />
    </>
  );
}
