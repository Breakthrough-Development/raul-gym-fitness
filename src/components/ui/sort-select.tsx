"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortSelectOption = {
  sortKey: string;
  sortValue: string;
  label: string;
};

export type SortObject = {
  sortKey: string;
  sortValue: string;
};

type SortSelectProps = {
  value: SortObject;
  onChange: (value: SortObject) => void;
  options: SortSelectOption[];
};

export const SortSelect = ({ options, value, onChange }: SortSelectProps) => {
  const handleSort = (compositeKey: string) => {
    const [sortKey, sortValue] = compositeKey.split("_");
    onChange({
      sortKey: sortKey,
      sortValue: sortValue,
    });
  };

  return (
    <Select
      defaultValue={value.sortKey + "_" + value.sortValue}
      onValueChange={handleSort}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.label}
            value={option.sortKey + "_" + option.sortValue}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
