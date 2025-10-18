"use client";

import { SortSelect, SortSelectOption } from "@/components/ui/sort-select";
import { useQueryStates } from "nuqs";
import { sortOptions, sortParser } from "../client-search-params";

type ClientSortSelectProps = {
  options: SortSelectOption[];
};
export const ClientSortSelect = ({ options }: ClientSortSelectProps) => {
  const [clientSort, setClientSort] = useQueryStates(sortParser, sortOptions);
  return (
    <SortSelect options={options} value={clientSort} onChange={setClientSort} />
  );
};
