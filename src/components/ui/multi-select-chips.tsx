"use client";

import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

type MultiSelectChipsProps = {
  title: string;
  name: string;
  options: string[];
  initialSelected: string[];
  inputPlaceholder?: string;
  addButtonLabel?: string;
};

export function MultiSelectChips({
  title,
  name,
  options,
  initialSelected,
  inputPlaceholder = "Type and press Enter to add your own",
  addButtonLabel = "Add",
}: MultiSelectChipsProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLowerSet = useMemo(
    () => new Set(selected.map((s) => s.toLowerCase())),
    [selected],
  );
  const optionLowerSet = useMemo(
    () => new Set(options.map((o) => o.toLowerCase())),
    [options],
  );

  const isSelected = (value: string) =>
    selectedLowerSet.has(value.toLowerCase());

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.some((item) => item.toLowerCase() === value.toLowerCase())
        ? prev.filter((item) => item.toLowerCase() !== value.toLowerCase())
        : [...prev, value],
    );
  };

  const addDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSelected((prev) =>
      prev.some((item) => item.toLowerCase() === trimmed.toLowerCase())
        ? prev
        : [...prev, trimmed],
    );
    setDraft("");
    inputRef.current?.focus();
  };

  const remove = (value: string) => {
    setSelected((prev) =>
      prev.filter((item) => item.toLowerCase() !== value.toLowerCase()),
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDraft();
    }
  };

  const customSelected = selected.filter(
    (item) => !optionLowerSet.has(item.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-indigo-950">{title}</p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = isSelected(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={
                isActive
                  ? "rounded-full border border-indigo-300 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-200"
                  : "rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-50"
              }
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inputPlaceholder}
          className="min-w-[200px] flex-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs text-indigo-950 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="button"
          onClick={addDraft}
          disabled={!draft.trim()}
          className="rounded-full bg-indigo-700 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-200"
        >
          {addButtonLabel}
        </button>
      </div>

      {customSelected.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700/80">
            Your additions
          </p>
          <div className="flex flex-wrap gap-2">
            {customSelected.map((value) => (
              <span
                key={value}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 py-1 pl-3 pr-1.5 text-xs font-semibold text-emerald-700"
              >
                {value}
                <button
                  type="button"
                  onClick={() => remove(value)}
                  aria-label={`Remove ${value}`}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full transition hover:bg-emerald-200"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {selected.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}

      <p className="text-xs text-muted-foreground">
        Selected ({selected.length}):{" "}
        {selected.length > 0 ? selected.join(", ") : "none"}
      </p>
    </div>
  );
}
