export default function InvoicePublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="light" style={{ colorScheme: "light", color: "#0a0a0a", backgroundColor: "#fafafa", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
