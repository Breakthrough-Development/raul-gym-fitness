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
import { ActionItemsSection } from "./components/action-items-section";
import { OptionItem } from "./components/option-item";
import { stopPropagation } from "./helpers";
import { useSearchableSelect } from "./hooks/use-searchable-select";
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
  const {
    search,
    setSearch,
    isOpen,
    setIsOpen,
    filteredOptions,
    handleClose,
    labelText,
    inputRef,
  } = useSearchableSelect({ options });

  return (
    <Select
      name={name}
      value={value}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSearch("");
        }
      }}
      onValueChange={onValueChange}
      disabled={disabled}
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
