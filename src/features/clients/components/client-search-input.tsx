"use client";
import { SearchInput } from "@/components/search-input";
import { useQueryState } from "nuqs";
import { searchParser } from "../client-search-params";

type ClientSearchInputProps = {
  placeholder: string;
};
export const ClientSearchInput = ({ placeholder }: ClientSearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);
  return (
    <SearchInput
      placeholder={placeholder}
      value={search}
      onChange={setSearch}
    />
  );
};
