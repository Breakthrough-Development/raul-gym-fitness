"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchableSelectOption = {
  value: string;
  label: string;
};

export type SearchableSelectActionItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

export type SearchableSelectOptionMenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
};

export type SearchableSelectProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  options: SearchableSelectOption[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  actionItems?: SearchableSelectActionItem[];
  onActionItemClick?: (actionId: string) => void;
  onValueChange?: (value: string) => void;
  showOptionsMenu?: boolean;
  optionMenuItems?: SearchableSelectOptionMenuItem[];
  onOptionMenuAction?: (optionValue: string, actionId: string) => void;
};

// Custom SelectContent that conditionally shows scroll buttons
const CustomSelectContent = ({
  className,
  children,
  position = "popper",
  showScrollButtons = true,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  showScrollButtons?: boolean;
}) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        {showScrollButtons && <SelectScrollUpButton />}
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {showScrollButtons && <SelectScrollDownButton />}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

export const SearchableSelect = ({
  name,
  placeholder = "Selecciona una opción",
  defaultValue,
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
}: SearchableSelectProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  // Use value if provided (controlled), otherwise use defaultValue (uncontrolled)
  const currentValue = value ?? defaultValue;

  // Get selected option for display
  const selectedOption = options.find(
    (option) => option.value === currentValue
  );

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  // Determine if we should show scroll buttons
  // Show them only if there are enough items to potentially scroll
  const shouldShowScrollButtons = filteredOptions.length > 5;

  return (
    <Select
      name={name}
      value={value}
      {...(value === undefined && { defaultValue })}
      open={isOpen}
      onOpenChange={setIsOpen}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedOption && selectedOption.label}
        </SelectValue>
      </SelectTrigger>
      <CustomSelectContent showScrollButtons={shouldShowScrollButtons}>
        <div className="p-2 border-b">
          <Input
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-base md:text-lg"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        {actionItems.length > 0 && (
          <div className="border-b">
            {actionItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="flex items-center gap-2 px-2 py-1.5 text-base md:text-lg justify-start w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onActionItemClick?.(item.id);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onActionItemClick?.(item.id);
                    setIsOpen(false);
                  }
                }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        )}
        <SelectGroup>
          <SelectLabel>
            {search
              ? `Resultados (${filteredOptions.length})`
              : `Todos (${options.length})`}
          </SelectLabel>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div key={option.value} className="relative">
                <SelectItem
                  value={option.value}
                  className={cn(
                    showOptionsMenu &&
                      onOptionMenuAction &&
                      optionMenuItems.length > 0
                      ? "pr-14 pl-3"
                      : "pl-3"
                  )}
                >
                  {option.label}
                </SelectItem>

                {showOptionsMenu &&
                  onOptionMenuAction &&
                  optionMenuItems.length > 0 && (
                    <div
                      className="absolute right-8 top-1/2 -translate-y-1/2 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          {optionMenuItems.map((item) => (
                            <DropdownMenuItem
                              key={item.id}
                              className={cn(
                                "flex items-center gap-2",
                                item.variant === "destructive" &&
                                  "text-destructive focus:text-destructive"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onOptionMenuAction(option.value, item.id);
                                setIsOpen(false);
                              }}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
              </div>
            ))
          ) : (
            <div className="px-2 py-1.5 text-base md:text-lg text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </SelectGroup>
      </CustomSelectContent>
    </Select>
  );
};
