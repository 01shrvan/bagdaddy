"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Add01Icon, Delete02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useTRPC } from "@/lib/trpc/client";
import { toast } from "sonner";

type Client = { id: string; name: string; email: string | null };
type Item = { id?: string; description: string; quantity: string; unitPrice: string };
type Invoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  clientId: string;
  projectId: string | null;
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

function money(q: string, p: string) {
  const n = parseFloat(q || "0") * parseFloat(p || "0");
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

function toDateInput(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function InvoiceEditor({
  invoice,
  items: initialItems,
  clients,
}: {
  invoice: Invoice;
  items: { id: string; description: string; quantity: string; unitPrice: string; total: string }[];
  clients: Client[];
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const qc = useQueryClient();

  const [clientId, setClientId] = useState(invoice.clientId);
  const [dueDate, setDueDate] = useState(toDateInput(invoice.dueDate));
  const [notes, setNotes] = useState(invoice.notes ?? "");
  const [items, setItems] = useState<Item[]>(
    initialItems.length > 0
      ? initialItems.map((i) => ({ id: i.id, description: i.description, quantity: i.quantity, unitPrice: i.unitPrice }))
      : [{ description: "", quantity: "1", unitPrice: "" }],
  );

  const total = items.reduce((sum, i) => {
    const n = parseFloat(i.quantity || "0") * parseFloat(i.unitPrice || "0");
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const update = useMutation(
    trpc.invoices.update.mutationOptions({
      onSuccess: ({ invoice: updated }) => {
        qc.setQueryData(trpc.invoices.list.queryOptions().queryKey, (old: any) =>
          old?.map((r: any) => r.invoice.id === updated.id ? { ...r, invoice: updated } : r) ?? [],
        );
        toast.success("Invoice saved");
      },
      onError: (err) => toast.error(err.message),
    }),
  );

  const addItem = () => setItems((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof Item, value: string) =>
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

  const handleSave = () => {
    if (!clientId) return toast.error("Select a client");
    const validItems = items.filter((i) => i.description.trim());
    if (!validItems.length) return toast.error("Add at least one line item");
    update.mutate({ id: invoice.id, clientId, dueDate: dueDate || undefined, notes: notes || undefined, items: validItems });
  };

  const selectedClient = clients.find((c) => c.id === clientId);

  return (
    <div className="min-h-screen bg-neutral-50/60">
      <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
        <button
          onClick={() => router.push("/invoices")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
          Invoices
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-muted-foreground">{invoice.invoiceNumber}</span>
          <span className={`text-xs font-medium px-2 py-0.5 ${STATUS_COLOR[invoice.status]}`}>
            {invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase()}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={update.isPending}
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.5} />
          {update.isPending ? "Saving…" : "Save"}
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="bg-white border border-neutral-200 shadow-sm">
          <div className="px-8 pt-10 pb-6 border-b border-neutral-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400 mb-1">Invoice</p>
                <p className="text-3xl font-bold tracking-tight text-neutral-900">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400 mb-1">Total</p>
                <p className="text-3xl font-bold tracking-tight text-neutral-900">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 border-b border-neutral-100">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400 mb-2">Bill to</p>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full text-sm font-medium text-neutral-900 bg-transparent border-0 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none pb-1 appearance-none cursor-pointer transition-colors"
                >
                  <option value="">Select client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {selectedClient?.email && (
                  <p className="text-xs text-neutral-400 mt-1">{selectedClient.email}</p>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400 mb-1.5">Issue date</p>
                  <p className="text-sm text-neutral-600">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400 mb-1">Due date</p>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="text-sm text-neutral-700 bg-transparent border-0 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none pb-0.5 w-full transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-5">
            <div className="grid grid-cols-[1fr_68px_96px_80px_28px] gap-2 mb-2 pb-2 border-b border-neutral-100">
              {["Description", "Qty", "Unit price", "Total", ""].map((h) => (
                <p key={h} className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">{h}</p>
              ))}
            </div>

            <div className="space-y-1">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_68px_96px_80px_28px] gap-2 items-center group">
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    placeholder="Description"
                    className="text-sm text-neutral-800 bg-transparent border-0 border-b border-transparent focus:border-neutral-300 focus:outline-none py-1.5 placeholder:text-neutral-300 transition-colors"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(i, "quantity", e.target.value)}
                    className="text-sm text-neutral-700 bg-transparent border-0 border-b border-transparent focus:border-neutral-300 focus:outline-none py-1.5 text-center transition-colors"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                    placeholder="0.00"
                    className="text-sm text-neutral-700 bg-transparent border-0 border-b border-transparent focus:border-neutral-300 focus:outline-none py-1.5 text-right placeholder:text-neutral-300 transition-colors"
                  />
                  <p className="text-sm text-neutral-700 text-right py-1.5 font-medium">
                    ${money(item.quantity, item.unitPrice)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    disabled={items.length === 1}
                    className="flex items-center justify-center h-6 w-6 text-neutral-300 hover:text-red-400 disabled:opacity-0 transition-colors"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={12} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-3 flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <HugeiconsIcon icon={Add01Icon} size={12} strokeWidth={2} />
              Add line item
            </button>
          </div>

          <div className="px-8 py-4 border-t border-neutral-100 flex justify-end">
            <div className="flex items-center gap-10">
              <span className="text-xs uppercase tracking-[0.14em] text-neutral-400">Total</span>
              <span className="text-2xl font-bold text-neutral-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="px-8 py-5 border-t border-neutral-100">
            <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400 mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment terms, bank details, thank you note…"
              rows={3}
              className="w-full text-sm text-neutral-600 bg-transparent border-0 focus:outline-none resize-none placeholder:text-neutral-300 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
