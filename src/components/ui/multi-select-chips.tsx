"use client";

import { useMemo, useState } from "react";

type MultiSelectChipsProps = {
  title: string;
  name: string;
  options: string[];
  initialSelected: string[];
};

export function MultiSelectChips({
  title,
  name,
  options,
  initialSelected,
}: MultiSelectChipsProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-indigo-950">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selectedSet.has(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={
                isActive
                  ? "rounded-full border border-indigo-300 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800"
                  : "rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
              }
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
      <p className="text-xs text-muted-foreground">
        Selected: {selected.length > 0 ? selected.join(", ") : "none"}
      </p>
    </div>
  );
}
