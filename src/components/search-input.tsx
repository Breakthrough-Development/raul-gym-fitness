"use client";
import { searchParser } from "@/features/ticket/search-params";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";

type SearchInputProps = {
  placeholder: string;
};

export const SearchInput = ({ placeholder }: SearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    250
  );

  return (
    <Input
      name="search"
      className="w-full"
      defaultValue={search}
      placeholder={placeholder}
      onChange={handleSearch}
    />
  );
};
