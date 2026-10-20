"use client";

/**
 * Social-proof ticker — the GSAP-owned marquee (motion ownership rule:
 * GSAP owns infinite loops/scroll effects; framer-motion never touches it).
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Star } from "lucide-react";
import { gsap } from "@/lib/gsap";

const ORDERS = [
  "Gabriel M. contratou Duo Boost 14.500 → 18.000 Premier",
  "Matheus R. contratou Solo Boost 5.000 → 10.000 Premier",
  "Ana L. contratou Coaching FPL (2 sessões)",
  "Lucas P. contratou Duo Boost 18.000 → 22.000 Premier",
  "Rafael S. contratou Otimizador de FPS + Tweaks",
  "Julia F. contratou Solo Boost 10.000 → 15.000 Premier",
];

export function Ticker() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const distance = track.scrollWidth / 2;
      gsap.to(track, { x: -distance, duration: 32, ease: "none", repeat: -1 });
    },
    { scope: rootRef }
  );

  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {ORDERS.map((order) => (
        <span
          key={order}
          className="flex items-center gap-2 whitespace-nowrap text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {order}
        </span>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className="ticker">
      <div className="mx-auto flex max-w-container items-center gap-4 px-6 py-2">
        <span className="hidden items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-text sm:flex">
          <span className="ticker-dot" />
          Pedidos ao vivo
        </span>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div ref={trackRef} className="flex w-max">
            {row}
            {row}
          </div>
        </div>

        <div className="hidden items-center gap-4 text-xs uppercase md:flex">
          <span className="flex items-center gap-1 text-primary">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-primary" />
            ))}
            <span className="font-bold text-text">4.9/5</span>
          </span>
          <span className="text-muted">1.480+ reviews</span>
        </div>
      </div>
    </div>
  );
}
