"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { PORTAL_COOKIE, PORTAL_COOKIE_MAX_AGE, EVENTS_URL } from "@/lib/portal";

type Side = "academy" | "events" | null;

interface Transition {
  status: "idle" | "expanding" | "shrinking";
  color: string;
  x: number;
  y: number;
}

const ACADEMY_STATS = ["4 Phases", "21 Modules", "130+ Hours"];
const EVENTS_NAV = ["Home", "Membership", "Impact", "Gallery"];

export function DualPortalLanding() {
  const router = useRouter();
  const [hover, setHover] = useState<Side>(null);
  // Touch devices never fire hover, so without this the panels would be
  // stuck in the dim "neither side chosen" look forever. On such devices
  // both panels default to their fully lit-up state instead.
  const [canHover, setCanHover] = useState(true);
  const [transition, setTransition] = useState<Transition>({
    status: "idle",
    color: "transparent",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(query.matches);
    const onChange = () => setCanHover(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const academyActive = canHover && hover === "academy";
  const eventsActive = canHover && hover === "events";
  const bothActive = !canHover;

  const academyLayerOpacity = bothActive ? 1 : eventsActive ? 0.08 : academyActive ? 1 : 0.45;
  const eventsLayerOpacity = bothActive ? 1 : academyActive ? 0.08 : eventsActive ? 1 : 0.45;
  const academyScale = bothActive || academyActive ? 1 : 0.94;
  const eventsScale = bothActive || eventsActive ? 1 : 0.94;
  const academyTextColor = !bothActive && eventsActive ? "rgba(255,255,255,0.28)" : "#0f172a";
  const eventsTextColor = !bothActive && academyActive ? "rgba(15,23,42,0.28)" : "#f3f0ff";

  let knobTransform = "translateX(0px)";
  if (academyActive) knobTransform = "translateX(-108px)";
  else if (eventsActive) knobTransform = "translateX(108px)";

  const enter = (side: "academy" | "events", e: React.MouseEvent, href: string) => {
    if (transition.status !== "idle") return;
    document.cookie = `${PORTAL_COOKIE}=${side}; path=/; max-age=${PORTAL_COOKIE_MAX_AGE}`;
    const color = side === "academy" ? "var(--mst-red)" : "var(--accent-purple)";
    setTransition({ status: "expanding", color, x: e.clientX, y: e.clientY });

    setTimeout(() => {
      if (side === "academy") {
        router.push(href);
      } else if (href !== "#") {
        window.location.href = href;
      }
      setTransition((prev) => ({ ...prev, status: "shrinking" }));

      setTimeout(() => {
        setTransition({ status: "idle", color: "transparent", x: 0, y: 0 });
      }, 700);
    }, 700);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050505] lg:h-screen lg:overflow-hidden">
      {/* Background layers */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: academyLayerOpacity,
          background:
            "radial-gradient(circle at 18% 28%, rgba(239,68,68,0.30), transparent 55%), radial-gradient(circle at 82% 18%, rgba(99,102,241,0.22), transparent 50%), #fdfcfb",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: eventsLayerOpacity,
          background:
            "radial-gradient(ellipse at 50% 75%, rgba(139,92,246,0.55), transparent 60%), #040404",
        }}
      />

      {/* Header logo pill */}
      <div className="absolute left-1/2 top-6 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#0b0b0f] px-4 py-2 shadow-lg shadow-black/40 sm:top-7 sm:px-[18px] sm:py-2.5">
        <img src="/mst-portal-icon.png" alt="" aria-hidden className="h-5 w-auto object-contain" />
        <span className="text-xs font-bold tracking-[0.02em] text-mst-red sm:text-sm">
          MASTERSTROKE
        </span>
        <span className="text-xs font-bold tracking-[0.14em] text-[#f5f5f5] sm:text-sm">
          ACADEMY
        </span>
      </div>

      {/* Center divider logo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] hidden -translate-x-1/2 -translate-y-1/2 lg:block">
        <img
          src="/mst-portal-icon.png"
          alt=""
          aria-hidden
          className="h-[280px] w-auto object-contain"
        />
      </div>

      {/* Dual portal container */}
      <div className="relative z-[2] flex flex-col pt-20 lg:absolute lg:inset-0 lg:flex-row lg:pt-0">
        {/* Path One: Academy */}
        <div
          role="link"
          tabIndex={0}
          aria-label="Enter Masterstroke Academy"
          className="relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 px-6 py-8 text-center transition-all duration-500 ease-out sm:gap-[18px] sm:px-10 lg:py-10"
          onMouseEnter={() => setHover("academy")}
          onMouseLeave={() => setHover(null)}
          onClick={(e) => enter("academy", e, "/academy")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              enter("academy", e as unknown as React.MouseEvent, "/academy");
            }
          }}
        >
          <div
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.24em] transition-colors duration-500 sm:text-[13px]"
            style={{ color: academyTextColor }}
          >
            <BookOpen size={14} /> PATH ONE &bull; LEARN
          </div>
          <div
            className="text-[40px] font-extrabold leading-none tracking-tight transition-colors duration-500 sm:text-[56px] lg:text-[84px]"
            style={{ color: academyTextColor }}
          >
            ACADEMY
          </div>
          <div
            className="max-w-[360px] text-sm leading-relaxed transition-colors duration-500 sm:text-base"
            style={{ color: academyTextColor, opacity: 0.8 }}
          >
            Structured courses, live code, and a path to funded founder.
          </div>

          {/* Academy browser mockup */}
          <div
            className="mt-1 w-[280px] overflow-hidden rounded-2xl bg-white transition-transform duration-500 ease-out sm:mt-3 sm:w-[340px]"
            style={{
              boxShadow: bothActive || academyActive
                ? "0 30px 70px rgba(224,52,44,0.25)"
                : "0 24px 60px rgba(0,0,0,.35)",
              transform: `scale(${academyScale})`,
            }}
          >
            <div className="flex h-[26px] items-center gap-[5px] bg-[#0b0b0f] px-2.5">
              <span className="h-[7px] w-[7px] rounded-full bg-mst-red" />
              <span className="h-[7px] w-[7px] rounded-full bg-[#f3b13a]" />
              <span className="h-[7px] w-[7px] rounded-full bg-[#3ac16c]" />
            </div>
            <div
              className="p-5 text-left"
              style={{
                background:
                  "radial-gradient(circle at 20% 10%, rgba(239,68,68,.12), transparent 60%), radial-gradient(circle at 90% 0%, rgba(99,102,241,.12), transparent 55%)",
              }}
            >
              <p className="text-lg font-extrabold text-[#0f172a]">Master Blockchain</p>
              <p className="mt-0.5 text-base font-extrabold text-mst-red">From Zero to Practice</p>
              <span className="mt-3 inline-block rounded-full bg-mst-red px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_4px_10px_rgba(224,52,44,0.2)]">
                Explore Plans
              </span>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {ACADEMY_STATS.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-black/[0.04] px-2 py-1 text-[9px] font-bold text-[#64748b]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="mt-1 flex items-center gap-1 text-[13px] font-bold tracking-wide transition-colors duration-500 sm:mt-2"
            style={{ color: academyTextColor }}
          >
            Enter Academy <ArrowRight size={14} />
          </div>
        </div>

        {/* Path Two: Events */}
        <div
          role="link"
          tabIndex={0}
          aria-label="Enter the Masterstroke Events community"
          className="relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 px-6 py-8 text-center transition-all duration-500 ease-out sm:gap-[18px] sm:px-10 lg:py-10"
          onMouseEnter={() => setHover("events")}
          onMouseLeave={() => setHover(null)}
          onClick={(e) => enter("events", e, EVENTS_URL)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              enter("events", e as unknown as React.MouseEvent, EVENTS_URL);
            }
          }}
        >
          <div
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.24em] transition-colors duration-500 sm:text-[13px]"
            style={{ color: eventsTextColor }}
          >
            <Calendar size={14} /> PATH TWO &bull; CONNECT
          </div>
          <div
            className="text-[40px] font-extrabold leading-none tracking-tight transition-colors duration-500 sm:text-[56px] lg:text-[84px]"
            style={{ color: eventsTextColor }}
          >
            EVENTS
          </div>
          <div
            className="max-w-[360px] text-sm leading-relaxed transition-colors duration-500 sm:text-base"
            style={{ color: eventsTextColor, opacity: 0.8 }}
          >
            A community of builders, talks, demo days, and launches.
          </div>

          {/* Events browser mockup */}
          <div
            className="mt-1 w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#050505] transition-transform duration-500 ease-out sm:mt-3 sm:w-[340px]"
            style={{
              boxShadow: bothActive || eventsActive
                ? "0 30px 70px rgba(139,92,246,0.3)"
                : "0 24px 60px rgba(0,0,0,.5)",
              transform: `scale(${eventsScale})`,
            }}
          >
            <div className="flex h-[26px] items-center gap-[5px] bg-[#0b0b0f] px-2.5">
              <span className="h-[7px] w-[7px] rounded-full bg-mst-red" />
              <span className="h-[7px] w-[7px] rounded-full bg-[#f3b13a]" />
              <span className="h-[7px] w-[7px] rounded-full bg-[#3ac16c]" />
            </div>
            <div
              className="p-5 text-left"
              style={{
                background: "radial-gradient(ellipse at 50% 90%, rgba(139,92,246,.5), transparent 65%)",
              }}
            >
              <div className="mb-2.5 flex gap-2.5 text-[9px] text-[#cfc9e0]">
                {EVENTS_NAV.map((item, i) => (
                  <span key={item} className={i === 0 ? "font-bold text-mst-red" : ""}>
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-base font-bold text-[#f5f3ff]">Turn Curiosity into Expertise.</p>
              <p className="mt-0.5 text-sm font-bold text-[#c4a6ff]">
                Build the Future You Believe In.
              </p>
              <div className="mt-3 flex gap-1.5">
                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#111]">
                  Join Academy
                </span>
                <span className="rounded-full border border-white/40 px-3 py-1.5 text-[10px] font-bold text-white">
                  Explore
                </span>
              </div>
            </div>
          </div>

          <div
            className="mt-1 flex items-center gap-1 text-[13px] font-bold tracking-wide transition-colors duration-500 sm:mt-2"
            style={{ color: eventsTextColor }}
          >
            Enter Community <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Slider selector knob */}
      <div className="pointer-events-none absolute bottom-[86px] left-1/2 z-[4] hidden h-[62px] w-[280px] -translate-x-1/2 items-center justify-center rounded-[32px] border border-white/10 bg-gradient-to-r from-mst-red to-[var(--accent-purple)] p-1.5 shadow-[0_14px_44px_rgba(0,0,0,.5)] lg:flex">
        <span className="absolute left-[22px] text-[10px] font-extrabold tracking-[0.1em] text-white/85">
          ACADEMY
        </span>
        <span className="absolute right-5 text-[10px] font-extrabold tracking-[0.1em] text-white/85">
          EVENTS
        </span>
        <span
          className="h-[50px] w-[50px] rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,.35)] transition-transform duration-500 ease-out"
          style={{ transform: knobTransform }}
        />
      </div>

      {/* Instructions */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-[3] mix-blend-difference hidden -translate-x-1/2 text-xs font-semibold tracking-[0.08em] text-white lg:block">
        HOVER A SIDE, THEN CLICK TO ENTER
      </div>

      {/* Circular wipe transition */}
      {transition.status !== "idle" && (
        <div
          className={`circular-wipe ${transition.status}`}
          style={{
            left: `${transition.x}px`,
            top: `${transition.y}px`,
            backgroundColor: transition.color,
          }}
        />
      )}
    </div>
  );
}
