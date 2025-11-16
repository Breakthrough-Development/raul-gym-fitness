"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActionItemsSection } from "./components/action-items-section";
import { OptionItem } from "./components/option-item";
import { filterOptions, getLabelText, stopPropagation } from "./helpers";
import type { SearchableSelectProps } from "./types";

export function SearchableSelect({
  name,
  value,
  options,
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron opciones",
  className,
  disabled = false,
  actionItems = [],
  onActionItemClick,
  onValueChange,
  showOptionsMenu = false,
  optionMenuItems = [],
  onOptionMenuAction,
}: SearchableSelectProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(
    () => filterOptions(options, search),
    [options, search]
  );

  useEffect(() => {
    if (!isOpen || !inputRef.current) return;
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);
  const labelText = getLabelText(
    search,
    filteredOptions.length,
    options.length
  );

  return (
    <Select
      name={name}
      value={value}
      onOpenChange={setIsOpen}
      onValueChange={onValueChange}
      disabled={disabled}
      defaultValue={options[0]?.value || undefined}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2 border-b">
          <Input
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-base md:text-lg"
            onClick={stopPropagation}
            onKeyDown={stopPropagation}
          />
        </div>
        <ActionItemsSection
          actionItems={actionItems}
          onActionItemClick={onActionItemClick}
          onClose={handleClose}
        />
        <SelectGroup>
          <SelectLabel>{labelText}</SelectLabel>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <OptionItem
                key={option.value}
                option={option}
                showMenu={showOptionsMenu}
                menuItems={optionMenuItems}
                onMenuAction={onOptionMenuAction}
                onClose={handleClose}
              />
            ))
          ) : (
            <div className="px-2 py-1.5 text-base md:text-lg text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
