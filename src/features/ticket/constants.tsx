import { LucideCircleCheck, LucideFileText, LucidePencil } from "lucide-react";

export const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCircleCheck />,
};

export const TICKET_STATUS_LABELS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
} as const;

export const SORT = {
  NEWEST: "newest",
  OLDEST: "oldest",
  STATUS_OPEN: "status-open",
  STATUS_IN_PROGRESS: "status-in-progress",
  STATUS_DONE: "status-done",
  BOUNTY_ASC: "bounty-asc",
  BOUNTY_DESC: "bounty-desc",
  TITLE_ASC: "title-asc",
  TITLE_DESC: "title-desc",
} as const;

export const SORT_OPTIONS = [
  { value: SORT.NEWEST, label: "Newest" },
  { value: SORT.OLDEST, label: "Oldest" },
  { value: SORT.STATUS_OPEN, label: "Status: Open" },
  { value: SORT.STATUS_IN_PROGRESS, label: "Status: In Progress" },
  { value: SORT.STATUS_DONE, label: "Status: Done" },
  { value: SORT.BOUNTY_ASC, label: "Lowest Bounty" },
  { value: SORT.BOUNTY_DESC, label: "Highest Bounty" },
  { value: SORT.TITLE_ASC, label: "A-Z" },
  { value: SORT.TITLE_DESC, label: "Z-A" },
];

