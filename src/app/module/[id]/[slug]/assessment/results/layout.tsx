export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-[var(--bg)] text-[var(--text)]">{children}</div>
  );
}
