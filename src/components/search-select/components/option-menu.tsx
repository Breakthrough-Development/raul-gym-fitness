"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { handleMenuAction, stopPropagation } from "../helpers";
import type { OptionMenuProps } from "../types";

export function OptionMenu({
  optionValue,
  menuItems,
  onAction,
  onClose,
}: OptionMenuProps) {
  if (menuItems.length === 0) return null;

  return (
    <div
      className="absolute right-8 top-1/2 -translate-y-1/2 z-10"
      onClick={stopPropagation}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              stopPropagation(e);
              e.preventDefault();
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={stopPropagation}>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className={cn(
                "flex items-center gap-2",
                item.variant === "destructive" &&
                  "text-destructive focus:text-destructive"
              )}
              onClick={(e) =>
                handleMenuAction(e, optionValue, item.id, onAction, onClose)
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
