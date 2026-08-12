import Link from "next/link";

const LINKS = [
  { label: "Developer Program Overview", href: "/academy-overview" },
  { label: "Ecosystem Learning Roadmap", href: "/learn" },
  { label: "Interactive Leaderboard", href: "/leaderboard" },
  { label: "Contact Developer Support", href: "/contact-us" },
];

/** Server component — plain static links, no client JS required at all. */
export default function AcademyLinksCard() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Academy Resources</h4>
      <ul className="space-y-2.5">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-[var(--text-muted)] hover:text-mst-red flex items-center gap-1.5 transition-colors duration-200"
            >
              <span className="text-mst-red font-bold text-sm leading-none">•</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
