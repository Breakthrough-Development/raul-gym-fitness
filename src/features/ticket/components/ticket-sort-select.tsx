"use client";

import { SortSelect, SortSelectOption } from "@/components/ui/sort-select";
import { useQueryStates } from "nuqs";
import { sortOptions, sortParser } from "../search-params";

type TicketSortSelectProps = {
  options: SortSelectOption[];
};
export const TicketSortSelect = ({ options }: TicketSortSelectProps) => {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);
  return <SortSelect options={options} value={sort} onChange={setSort} />;
};
