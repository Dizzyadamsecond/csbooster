/**
 * GSAP singleton + ScrollTrigger registration (client only).
 * Ownership rule: GSAP owns timelines, marquees and scroll-driven effects.
 * Never animate the same element with framer-motion at the same time.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
