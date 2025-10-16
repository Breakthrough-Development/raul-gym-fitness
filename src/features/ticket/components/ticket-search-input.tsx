"use client";
import { SearchInput } from "@/components/search-input";
import { useQueryState } from "nuqs";
import { searchParser } from "../ticket-search-params";

type TicketSearchInputProps = {
  placeholder: string;
};
export const TicketSearchInput = ({ placeholder }: TicketSearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);
  return (
    <SearchInput
      placeholder={placeholder}
      value={search}
      onChange={setSearch}
    />
  );
};
