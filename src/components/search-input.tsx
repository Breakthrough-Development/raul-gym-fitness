"use client";

import { LucideSearch } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
};

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  label = "Buscar",
}: SearchInputProps) => {
  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    250
  );

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="search" className="sr-only">
        {label}
      </Label>
      <div className="relative">
        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          name="search"
          className="w-full pl-10"
          defaultValue={value}
          placeholder={placeholder}
          onChange={handleSearch}
          data-testid="notification-search-input"
        />
      </div>
    </div>
  );
};
