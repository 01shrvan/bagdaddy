"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Add01Icon, Delete02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useTRPC } from "@/lib/trpc/client";
import { toast } from "sonner";

export type EditorClient = { id: string; name: string; email: string | null };
export type EditorItem = { description: string; quantity: string; unitPrice: string };

type ExistingInvoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  clientId: string;
  dueDate: Date | null;
  totalAmount: string;
  notes: string | null;
  publicToken: string | null;
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-neutral-100 text-neutral-500",
  SENT: "bg-blue-50 text-blue-600",
  PAID: "bg-emerald-50 text-emerald-700",
  OVERDUE: "bg-red-50 text-red-600",
};

function calcLine(qty: string, price: string) {
  const n = parseFloat(qty || "0") * parseFloat(price || "0");
  return isNaN(n) ? 0 : n;
}

function toDateInput(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a3a3a3", marginBottom: 6 }}>
        {label}
      </p>
      {children}
    </div>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%",
  fontSize: 13,
  color: "#0a0a0a",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #e5e5e5",
  outline: "none",
  padding: "2px 0 4px",
  fontFamily: "inherit",
};

export function InvoiceEditor({
  invoice,
  items: initialItems,
  clients,
}: {
  invoice?: ExistingInvoice;
  items?: { description: string; quantity: string; unitPrice: string }[];
  clients: EditorClient[];
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const qc = useQueryClient();
  const isEdit = Boolean(invoice);

  const [clientId, setClientId] = useState(invoice?.clientId ?? "");
  const [dueDate, setDueDate] = useState(toDateInput(invoice?.dueDate));
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [items, setItems] = useState<EditorItem[]>(
    initialItems && initialItems.length > 0
      ? initialItems.map((i) => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice }))
      : [{ description: "", quantity: "1", unitPrice: "" }],
  );

  const total = items.reduce((sum, i) => sum + calcLine(i.quantity, i.unitPrice), 0);

  const create = useMutation(
    trpc.invoices.create.mutationOptions({
      onSuccess: (newInvoice) => {
        qc.setQueryData(trpc.invoices.list.queryOptions().queryKey, (old: any) =>
          old ? [{ invoice: newInvoice, clientName: clients.find((c) => c.id === clientId)?.name ?? "" }, ...old] : [],
        );
        toast.success("Invoice created");
        router.push("/invoices");
      },
      onError: (err) => toast.error(err.message),
    }),
  );

  const update = useMutation(
    trpc.invoices.update.mutationOptions({
      onSuccess: ({ invoice: updated }) => {
        qc.setQueryData(trpc.invoices.list.queryOptions().queryKey, (old: any) =>
          old?.map((r: any) => (r.invoice.id === updated.id ? { ...r, invoice: updated } : r)) ?? [],
        );
        toast.success("Invoice saved");
      },
      onError: (err) => toast.error(err.message),
    }),
  );

  const isPending = create.isPending || update.isPending;

  function handleSave() {
    if (!clientId) return toast.error("Select a client");
    const validItems = items.filter((i) => i.description.trim() && i.unitPrice);
    if (!validItems.length) return toast.error("Add at least one line item with a description and price");

    if (isEdit && invoice) {
      update.mutate({
        id: invoice.id,
        clientId,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
        items: validItems,
      });
    } else {
      create.mutate({
        clientId,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
        items: validItems,
      });
    }
  }

  const addItem = () => setItems((p) => [...p, { description: "", quantity: "1", unitPrice: "" }]);
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  const setItem = (i: number, field: keyof EditorItem, val: string) =>
    setItems((p) => p.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  const selectedClient = clients.find((c) => c.id === clientId);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8" }}>
      <header style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 48, borderBottom: "1px solid #e5e5e5",
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
        padding: "0 24px",
      }}>
        <button
          onClick={() => router.push("/invoices")}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#737373", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#737373")}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
          Invoices
        </button>
        {invoice && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#a3a3a3" }}>{invoice.invoiceNumber}</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 2, ...(STATUS_COLOR[invoice.status] ? {} : {}) }}
              className={STATUS_COLOR[invoice.status]}>
              {invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}
            </span>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isPending}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 500, padding: "6px 14px",
            background: "#0a0a0a", color: "#fff", border: "none", cursor: "pointer",
            opacity: isPending ? 0.5 : 1,
          }}
        >
          <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.5} />
          {isPending ? "Saving…" : isEdit ? "Save" : "Create invoice"}
        </button>
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e5e5", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>

          <div style={{ padding: "36px 40px 28px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c4c4c4", margin: "0 0 4px" }}>Invoice</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#0a0a0a", margin: 0, letterSpacing: "-0.5px" }}>
                  {invoice?.invoiceNumber ?? "New invoice"}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c4c4c4", margin: "0 0 4px" }}>Total</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#0a0a0a", margin: 0, letterSpacing: "-0.5px" }}>
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div style={{ padding: "24px 40px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <Field label="Bill to">
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  style={{ ...inputBase, cursor: "pointer", appearance: "none" }}
                >
                  <option value="">Select client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {selectedClient?.email && (
                  <p style={{ fontSize: 11, color: "#a3a3a3", marginTop: 4 }}>{selectedClient.email}</p>
                )}
              </Field>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Issue date">
                  <p style={{ fontSize: 13, color: "#525252", margin: 0, paddingBottom: 4 }}>
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </Field>
                <Field label="Due date">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ ...inputBase }}
                  />
                </Field>
              </div>
            </div>
          </div>

          <div style={{ padding: "20px 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 64px 100px 84px 24px", gap: 8, paddingBottom: 10, borderBottom: "1px solid #f0f0f0", marginBottom: 4 }}>
              {["Description", "Qty", "Unit price", "Total", ""].map((h, i) => (
                <p key={i} style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c4c4c4", margin: 0 }}>{h}</p>
              ))}
            </div>

            {items.map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 64px 100px 84px 24px", gap: 8, alignItems: "center", borderBottom: "1px solid #f9f9f9", padding: "4px 0" }}>
                <input
                  value={item.description}
                  onChange={(e) => setItem(i, "description", e.target.value)}
                  placeholder="Service or item…"
                  style={{ ...inputBase, borderBottom: "1px solid transparent" }}
                  onFocus={(e) => (e.target.style.borderBottomColor = "#e5e5e5")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "transparent")}
                />
                <input
                  type="number" min="0" step="0.01"
                  value={item.quantity}
                  onChange={(e) => setItem(i, "quantity", e.target.value)}
                  style={{ ...inputBase, textAlign: "center", borderBottom: "1px solid transparent" }}
                  onFocus={(e) => (e.target.style.borderBottomColor = "#e5e5e5")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "transparent")}
                />
                <input
                  type="number" min="0" step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => setItem(i, "unitPrice", e.target.value)}
                  placeholder="0.00"
                  style={{ ...inputBase, textAlign: "right", borderBottom: "1px solid transparent" }}
                  onFocus={(e) => (e.target.style.borderBottomColor = "#e5e5e5")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "transparent")}
                />
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", textAlign: "right", margin: 0 }}>
                  ${calcLine(item.quantity, item.unitPrice).toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: "none", border: "none", cursor: "pointer", color: "#d4d4d4", opacity: items.length === 1 ? 0 : 1 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#d4d4d4")}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={12} strokeWidth={2} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12, color: "#a3a3a3", background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a3a3a3")}
            >
              <HugeiconsIcon icon={Add01Icon} size={12} strokeWidth={2} />
              Add line item
            </button>
          </div>

          <div style={{ padding: "16px 40px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 40 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a3a3a3" }}>Total</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#0a0a0a" }}>${total.toFixed(2)}</span>
          </div>

          <div style={{ padding: "16px 40px 28px", borderTop: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c4c4c4", marginBottom: 8 }}>Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment terms, bank details, thank you note…"
              rows={3}
              style={{ width: "100%", fontSize: 13, color: "#525252", background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.7 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
