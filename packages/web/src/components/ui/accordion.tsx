import React from "react";

export interface AccordionItemProps {
  question: string;
  answer: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border border-line-soft rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-text hover:bg-surface-2 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {question}
        <span className="text-red-400 transition-transform duration-200">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-4 py-3 pb-4 text-muted text-sm leading-relaxed border-t border-line-soft pt-2">
          {answer}
        </div>
      )}
    </div>
  );
};
