export function MarketingHeroBackground({ tall = false }: { tall?: boolean }) {
  return (
    <>
      <div className="landing-glow pointer-events-none absolute inset-0" />
      <div
        className="hero-mesh pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
      />
      <div
        className={`hero-orb pointer-events-none absolute -left-40 rounded-full bg-mst-red/25 blur-3xl ${
          tall ? "top-10 h-[28rem] w-[28rem]" : "top-20 h-72 w-72 bg-mst-red/20"
        }`}
        aria-hidden
      />
      <div
        className={`hero-orb hero-orb-delay-1 pointer-events-none absolute -right-32 rounded-full bg-[var(--accent-purple)]/20 blur-3xl ${
          tall ? "top-24 h-[32rem] w-[32rem]" : "top-40 h-96 w-96 bg-[var(--accent-purple)]/15"
        }`}
        aria-hidden
      />
      <div
        className={`hero-orb hero-orb-delay-2 pointer-events-none absolute rounded-full bg-[var(--accent-cyan)]/15 blur-3xl ${
          tall ? "bottom-0 left-1/4 h-80 w-80" : "bottom-10 left-1/3 h-64 w-64"
        }`}
        aria-hidden
      />
      <div
        className="hero-orb pointer-events-none absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-mst-red/10 blur-2xl"
        style={{ animationDelay: "-6s" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]" />
    </>
  );
}
