import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type ProgressSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ProgressSearchBar({ value, onChange }: ProgressSearchBarProps) {
  return (
    <div className="search-input-wrapper">
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-[1.125rem] -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar exercício..."
        aria-label="Buscar exercício"
        className="search-input"
      />
    </div>
  );
}
