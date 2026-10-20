import React from "react";

interface FeatureCardProps {
  feature: {
    id: number;
    title: string;
    description: string;
    icon: string;
  };
}

export default function FeatureCard({feature}: FeatureCardProps) {
  return (
    <div className="group border border-line rounded-xl p-6 md:p-8 bg-surface hover:bg-surface/90 transition-colors duration-200 shadow-sm hover:shadow-md group-hover:shadow-lg">
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">{feature.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-text font-semibold mb-1 transition-all group-hover:text-red-600 duration-200">{feature.title}</h3>
          <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}