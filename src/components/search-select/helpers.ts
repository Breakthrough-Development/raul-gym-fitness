import type { SearchableSelectOption } from "./types";

export function filterOptions(
  options: SearchableSelectOption[],
  search: string
): SearchableSelectOption[] {
  if (!search.trim()) return options;
  return options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );
}

export function stopPropagation(e: React.MouseEvent | React.KeyboardEvent) {
  e.stopPropagation();
}

export function getSelectedOption(
  options: SearchableSelectOption[],
  value: string | undefined,
): SearchableSelectOption | undefined {
  return options.find((option) => option.value === value);
}

export function getLabelText(
  search: string,
  filteredCount: number,
  totalCount: number
): string {
  return search
    ? `Resultados (${filteredCount})`
    : `Todos (${totalCount})`;
}

export function handleActionClick(
  e: React.MouseEvent,
  actionId: string,
  onActionItemClick?: (actionId: string) => void,
  onClose?: () => void
) {
  stopPropagation(e);
  onActionItemClick?.(actionId);
  onClose?.();
}

export function handleActionKeyDown(
  e: React.KeyboardEvent,
  actionId: string,
  onActionItemClick?: (actionId: string) => void,
  onClose?: () => void
) {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  stopPropagation(e);
  onActionItemClick?.(actionId);
  onClose?.();
}

export function handleMenuAction(
  e: React.MouseEvent,
  optionValue: string,
  actionId: string,
  onAction: (optionValue: string, actionId: string) => void,
  onClose?: () => void
) {
  e.preventDefault();
  stopPropagation(e);
  onAction(optionValue, actionId);
  onClose?.();
}

