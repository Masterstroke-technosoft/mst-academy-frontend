const TOPICS = ["Web3", "Blockchain", "Validators", "DeFi", "Smart Contracts", "Tutorials"];


export default function TopicsCard() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Explore Topics</h4>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-[var(--border)] bg-[var(--bg)] hover:border-mst-red/40 hover:bg-mst-red/5 px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] hover:text-mst-red hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
