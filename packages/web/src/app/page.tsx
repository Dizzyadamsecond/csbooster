import type { ReactNode } from "react";
import FeatureCard from "@/components/features/FeatureCard";

/* Feature data - 5 essential features (trimmed by first principles) */
const features = [
  {
    id: 1,
    title: "Process Priority Optimization",
    description: "Set CS2 process to THREAD_PRIORITY_TIME_CRITICAL priority class. This is the #1 feature for performance improvement, giving CS2 scheduler priority over other processes.",
    icon: "⚡",
  },
  {
    id: 2,
    title: "Memory Optimization",
    description: "Enable large page support, trim working set, and optimize memory allocation for CS2. Reduces memory pressure and prevents stuttering during gameplay.",
    icon: "💾",
  },
  {
    id: 3,
    title: "One-Click Apply/Revert",
    description: "Single button to apply all optimizations or revert to stock settings. Critical for quick switching between optimized and normal modes.",
    icon: "🖱️",
  },
  {
    id: 4,
    title: "Before/After Comparison",
    description: "Display FPS improvements side-by-side (Stock vs Optimized). Shows users the tangible benefits of the optimizer.",
    icon: "📈",
  },
  {
    id: 5,
    title: "CS2 Process Detection",
    description: "Automatic detection of cs2.exe or cs2_r5.exe running status. The optimizer must know when CS2 is running to apply/revert changes.",
    icon: "🔍",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background antialiased">
      <nav className="border-b border-border px-6 py-4 md:px-8 md:py-8 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-1">
              Cs2Booster
            </h1>
            <p className="text-muted-foreground text-lg">
              CS2 Performance Optimizer
            </p>
          </div>
          <div className="hidden md:block">
            Dashboard
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto py-12 px-6 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
          Essential Features
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl">
          Discover the 5 essential features that make Cs2Booster the ultimate
          Counter-Strike 2 performance optimizer. Optimize your system, monitor
          performance, and achieve your best FPS ever.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </section>
    </main>
  );
}