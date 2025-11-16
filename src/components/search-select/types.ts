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

export type ActionItemsSectionProps = {
  actionItems: SearchableSelectActionItem[];
  onActionItemClick?: (actionId: string) => void;
  onClose: () => void;
};

export type OptionMenuProps = {
  optionValue: string;
  menuItems: SearchableSelectOptionMenuItem[];
  onAction: (optionValue: string, actionId: string) => void;
  onClose: () => void;
};

export type OptionItemProps = {
  option: SearchableSelectOption;
  showMenu: boolean;
  menuItems: SearchableSelectOptionMenuItem[];
  onMenuAction?: (optionValue: string, actionId: string) => void;
  onClose: () => void;
};

