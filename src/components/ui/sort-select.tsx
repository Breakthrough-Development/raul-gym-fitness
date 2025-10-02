"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Option = {
  value: string;
  label: string;
};

type SortSelectProps = {
  defaultValue?: string;
  options: Option[];
};

export const SortSelect = ({ defaultValue, options }: SortSelectProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    replace(
      `${pathname}?${params.toString()}` as Route<`${string}?${string}`>,
      {
        scroll: false,
      }
    );
  };

  return (
    <Select
      defaultValue={searchParams.get("sort")?.toString() || defaultValue}
      onValueChange={handleSort}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
