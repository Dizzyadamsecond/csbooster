"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  accordionContent,
  accordionContentReduced,
  DURATION,
  EASE,
} from "@/lib/motion";

export interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  defaultOpen = false,
  className,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion ? accordionContentReduced : accordionContent;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-200",
        open && "border-line-strong",
        className
      )}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-medium text-text transition-colors duration-200 hover:bg-surface-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: DURATION.base, ease: EASE.standard }
          }
          className="inline-flex shrink-0 items-center justify-center text-primary-text"
        >
          <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={panelId}
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            variants={variants}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            className="overflow-hidden"
          >
            <div className="border-t border-line px-4 py-3 text-sm leading-relaxed text-muted">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
