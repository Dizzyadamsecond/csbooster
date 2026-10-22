"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  panelClassName?: string;
  orientation?: "horizontal" | "vertical";
}

export interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className, tabClassName, panelClassName, orientation = "horizontal" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    const isHorizontal = orientation === "horizontal";

    switch (event.key) {
      case isHorizontal ? "ArrowRight" : "ArrowDown":
        event.preventDefault();
        newIndex = (index + 1) % tabs.length;
        break;
      case isHorizontal ? "ArrowLeft" : "ArrowUp":
        event.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    // Skip disabled tabs
    while (tabs[newIndex]?.disabled) {
      newIndex = (newIndex + 1) % tabs.length;
      if (newIndex === index) return; // all disabled
    }

    const newTab = tabs[newIndex];
    setActiveTab(newTab.id);
    onChange?.(newTab.id);
    (tabsRef.current?.querySelector(`[role="tab"][data-index="${newIndex}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={tabsRef}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          "flex gap-1 p-1 rounded-2xl border border-line bg-surface",
          orientation === "horizontal" ? "overflow-x-auto" : "flex-col"
        )}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            data-index={index}
            disabled={tab.disabled}
            className={cn(
              "relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              activeTab === tab.id
                ? "bg-primary-soft text-primary-soft-text shadow-sm"
                : "text-text-secondary hover:text-text hover:bg-surface-2",
              tabClassName
            )}
            onClick={() => {
              if (!tab.disabled) {
                setActiveTab(tab.id);
                onChange?.(tab.id);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.icon && <span className="mr-2 flex h-4 w-4" aria-hidden="true">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4" role="tabpanel" aria-labelledby={`tab-${activeTab}`} id={`panel-${activeTab}`} tabIndex={0}>
        {tabs
          .filter((tab) => tab.id === activeTab)
          .map((tab) => (
            <div key={tab.id} className={cn("animate-fade-in", panelClassName)}>
              {/* Panel content rendered by parent via context or render prop */}
            </div>
          ))}
      </div>
    </div>
  );
}

export function TabPanels({ activeTab, children }: { activeTab: string; children: React.ReactNode }) {
  return (
    <div role="tabpanel" aria-labelledby={`tab-${activeTab}`} id={`panel-${activeTab}`} tabIndex={0}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        const childId = (child.props as any).id || (child.props as any).tabId;
        if (childId === activeTab) return child;
        return null;
      })}
    </div>
  );
}

export function TabPanel({ id, children, className }: TabPanelProps) {
  return <div id={id} className={cn("animate-fade-in", className)}>{children}</div>;
}