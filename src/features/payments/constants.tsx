import { LucideCircleCheck, LucideFileText, LucidePencil } from "lucide-react";
export const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCircleCheck />,
};

export const TICKET_KEYS = {
  CREATED_AT: "createdAt",
  FIRSTNAME: "firstName",
} as const;

export const SORT_VALUES = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const SORT_LABELS = {
  NEWEST: "Newest",
  OLDEST: "Oldest",
  A_Z: "A-Z",
  Z_A: "Z-A",
} as const;

export const SORT_OPTIONS = [
  {
    sortKey: TICKET_KEYS.CREATED_AT,
    sortValue: SORT_VALUES.DESC,
    label: SORT_LABELS.NEWEST,
  },
  {
    sortKey: TICKET_KEYS.CREATED_AT,
    sortValue: SORT_VALUES.ASC,
    label: SORT_LABELS.OLDEST,
  },
  {
    sortKey: TICKET_KEYS.FIRSTNAME,
    sortValue: SORT_VALUES.ASC,
    label: SORT_LABELS.A_Z,
  },
  {
    sortKey: TICKET_KEYS.FIRSTNAME,
    sortValue: SORT_VALUES.DESC,
    label: SORT_LABELS.Z_A,
  },
];

export const PAGINATION_PAGE_DEFAULT = 0;
export const PAGINATION_SIZE_DEFAULT = 10;

export const PAGINATION_SIZE_OPTIONS = [
  { value: `${PAGINATION_SIZE_DEFAULT}`, label: `${PAGINATION_SIZE_DEFAULT}` },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];
