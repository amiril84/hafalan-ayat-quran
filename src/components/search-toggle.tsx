"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type SearchToggleProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchToggle({
  value,
  onChange,
  placeholder = "Cari surat atau tema",
}: SearchToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-80">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={inputId}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-muted active:scale-[0.99]"
      >
        {isOpen ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Search className="h-4 w-4" aria-hidden="true" />
        )}
        {isOpen ? "Tutup pencarian" : "Cari ayat"}
      </button>
      {isOpen ? (
        <div>
          <label htmlFor={inputId} className="sr-only">
            Cari berdasarkan nama surat atau tema
          </label>
          <input
            id={inputId}
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="min-h-11 w-full rounded-md border border-border bg-white px-4 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      ) : null}
    </div>
  );
}
