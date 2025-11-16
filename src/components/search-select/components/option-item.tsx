"use client";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { OptionItemProps } from "../types";
import { OptionMenu } from "./option-menu";

export function OptionItem({
  option,
  showMenu,
  menuItems,
  onMenuAction,
  onClose,
}: OptionItemProps) {
  const hasMenu = showMenu && onMenuAction && menuItems.length > 0;

  return (
    <div className="relative">
      <SelectItem
        value={option.value}
        className={cn(hasMenu ? "pr-14 pl-3" : "pl-3")}
      >
        {option.label}
      </SelectItem>
      {hasMenu && (
        <OptionMenu
          optionValue={option.value}
          menuItems={menuItems}
          onAction={onMenuAction}
          onClose={onClose}
        />
      )}
    </div>
  );
}
