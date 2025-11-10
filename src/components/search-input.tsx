"use client";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export const SearchInput = ({
  value,
  onChange,
  placeholder,
}: SearchInputProps) => {
  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    250
  );

  return (
    <Input
      name="search"
      className="w-full"
      defaultValue={value}
      placeholder={placeholder}
      onChange={handleSearch}
      data-testid="notification-search-input"
    />
  );
};
