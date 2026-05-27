import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", padding: 52, fontSize: 10, color: "#0a0a0a", backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 },
  brand: { fontSize: 13, fontFamily: "Helvetica-Bold", letterSpacing: -0.3 },
  invoiceNum: { fontSize: 11, color: "#737373" },
  section: { flexDirection: "row", marginBottom: 36 },
  col: { flex: 1 },
  label: { fontSize: 7.5, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 },
  val: { fontSize: 10, color: "#0a0a0a", marginBottom: 2 },
  subVal: { fontSize: 9, color: "#737373" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e5e5e5", marginBottom: 6 },
  tableHead: { flexDirection: "row", paddingBottom: 8, marginBottom: 0, fontSize: 7.5, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: 0.6 },
  tableRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f5f5f5" },
  desc: { flex: 3 },
  qty: { flex: 1, textAlign: "right" },
  price: { flex: 1.2, textAlign: "right" },
  total: { flex: 1.2, textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#e5e5e5", gap: 32 },
  totalLabel: { fontSize: 9, color: "#737373" },
  totalAmt: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  notes: { marginTop: 40 },
  footer: { position: "absolute", bottom: 36, left: 52, right: 52, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: "#d4d4d4" },
});

export type InvoicePDFProps = {
  invoiceNumber: string;
  fromName: string;
  fromEmail: string;
  clientName: string;
  clientEmail?: string | null;
  issueDate: string;
  dueDate?: string | null;
  items: Array<{ description: string; quantity: string; unitPrice: string; total: string }>;
  totalAmount: string;
  notes?: string | null;
};

export function InvoicePDF({
  invoiceNumber,
  fromName,
  fromEmail,
  clientName,
  clientEmail,
  issueDate,
  dueDate,
  items,
  totalAmount,
  notes,
}: InvoicePDFProps) {
  return (
    <Document title={invoiceNumber} author={fromName}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.brand}>bagdaddy</Text>
          <Text style={s.invoiceNum}>{invoiceNumber}</Text>
        </View>

        <View style={s.section}>
          <View style={s.col}>
            <Text style={s.label}>From</Text>
            <Text style={s.val}>{fromName}</Text>
            <Text style={s.subVal}>{fromEmail}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.label}>To</Text>
            <Text style={s.val}>{clientName}</Text>
            {clientEmail ? <Text style={s.subVal}>{clientEmail}</Text> : null}
          </View>
          <View style={s.col}>
            <Text style={s.label}>Issue date</Text>
            <Text style={s.val}>{issueDate}</Text>
            {dueDate ? (
              <>
                <Text style={{ ...s.label, marginTop: 12 }}>Due date</Text>
                <Text style={s.val}>{dueDate}</Text>
              </>
            ) : null}
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.tableHead}>
          <Text style={s.desc}>Description</Text>
          <Text style={s.qty}>Qty</Text>
          <Text style={s.price}>Unit price</Text>
          <Text style={s.total}>Total</Text>
        </View>

        <View style={s.divider} />

        {items.map((item, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={s.desc}>{item.description}</Text>
            <Text style={s.qty}>{item.quantity}</Text>
            <Text style={s.price}>${parseFloat(item.unitPrice).toFixed(2)}</Text>
            <Text style={s.total}>${parseFloat(item.total).toFixed(2)}</Text>
          </View>
        ))}

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalAmt}>${parseFloat(totalAmount).toFixed(2)}</Text>
        </View>

        {notes ? (
          <View style={s.notes}>
            <Text style={s.label}>Notes</Text>
            <Text style={{ fontSize: 9, color: "#737373", lineHeight: 1.7 }}>{notes}</Text>
          </View>
        ) : null}

        <View style={s.footer}>
          <Text>bagdaddy</Text>
          <Text>{invoiceNumber}</Text>
        </View>
      </Page>
    </Document>
  );
}
