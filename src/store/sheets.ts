import { create } from "zustand";

export type ClientEntity = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
};

export type ProjectEntity = {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  hourlyRate: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  createdAt: Date;
};

export type ProjectRow = {
  project: ProjectEntity;
  clientName: string;
};

interface SheetsStore {
  // Clients
  clientCreate: boolean;
  clientEdit: ClientEntity | null;
  clientDelete: string | null;
  openClientCreate: () => void;
  closeClientCreate: () => void;
  openClientEdit: (client: ClientEntity) => void;
  closeClientEdit: () => void;
  openClientDelete: (id: string) => void;
  closeClientDelete: () => void;

  // Projects
  projectCreate: boolean;
  projectEdit: ProjectRow | null;
  projectDelete: string | null;
  openProjectCreate: () => void;
  closeProjectCreate: () => void;
  openProjectEdit: (row: ProjectRow) => void;
  closeProjectEdit: () => void;
  openProjectDelete: (id: string) => void;
  closeProjectDelete: () => void;

  // Time
  timeCreate: boolean;
  timeDelete: string | null;
  openTimeCreate: () => void;
  closeTimeCreate: () => void;
  openTimeDelete: (id: string) => void;
  closeTimeDelete: () => void;

  // Invoices
  invoiceCreate: boolean;
  invoiceDelete: string | null;
  openInvoiceCreate: () => void;
  closeInvoiceCreate: () => void;
  openInvoiceDelete: (id: string) => void;
  closeInvoiceDelete: () => void;
}

export const useSheetsStore = create<SheetsStore>((set) => ({
  // Clients
  clientCreate: false,
  clientEdit: null,
  clientDelete: null,
  openClientCreate: () => set({ clientCreate: true }),
  closeClientCreate: () => set({ clientCreate: false }),
  openClientEdit: (client) => set({ clientEdit: client }),
  closeClientEdit: () => set({ clientEdit: null }),
  openClientDelete: (id) => set({ clientDelete: id }),
  closeClientDelete: () => set({ clientDelete: null }),

  // Projects
  projectCreate: false,
  projectEdit: null,
  projectDelete: null,
  openProjectCreate: () => set({ projectCreate: true }),
  closeProjectCreate: () => set({ projectCreate: false }),
  openProjectEdit: (row) => set({ projectEdit: row }),
  closeProjectEdit: () => set({ projectEdit: null }),
  openProjectDelete: (id) => set({ projectDelete: id }),
  closeProjectDelete: () => set({ projectDelete: null }),

  // Time
  timeCreate: false,
  timeDelete: null,
  openTimeCreate: () => set({ timeCreate: true }),
  closeTimeCreate: () => set({ timeCreate: false }),
  openTimeDelete: (id) => set({ timeDelete: id }),
  closeTimeDelete: () => set({ timeDelete: null }),

  // Invoices
  invoiceCreate: false,
  invoiceDelete: null,
  openInvoiceCreate: () => set({ invoiceCreate: true }),
  closeInvoiceCreate: () => set({ invoiceCreate: false }),
  openInvoiceDelete: (id) => set({ invoiceDelete: id }),
  closeInvoiceDelete: () => set({ invoiceDelete: null }),
}));
