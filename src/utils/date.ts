import { env } from "@/env";

const DEFAULT_TZ = env.TIMEZONE;

export type YearMonth = { year: number; month: number }; // month: 1-12

export function getTodayInTimeZone(timeZone: string = DEFAULT_TZ) {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  return { year, month, day };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function getCurrentYearMonth(timeZone: string = DEFAULT_TZ): YearMonth {
  const { year, month } = getTodayInTimeZone(timeZone);
  return { year, month };
}

export function getPrevYearMonth({ year, month }: YearMonth): YearMonth {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

export function getNextYearMonth({ year, month }: YearMonth): YearMonth {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
}

// UTC ranges suitable for Prisma: [gte, lt)
export function getUtcMonthRange({ year, month }: YearMonth) {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const next =
    month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
  const end = new Date(Date.UTC(next.year, next.month - 1, 1, 0, 0, 0));
  return { start, end };
}

export function isPreEomReminderDay(timeZone: string = DEFAULT_TZ) {
  const { year, month, day } = getTodayInTimeZone(timeZone);
  const dim = daysInMonth(year, month);
  return day === dim - 3;
}

export function isPostEomReminderDay(timeZone: string = DEFAULT_TZ) {
  const { day } = getTodayInTimeZone(timeZone);
  return day === 3;
}

export function monthLongName(year: number, month: number, locale = "en-US") {
  const d = new Date(Date.UTC(year, month - 1, 1));
  return d.toLocaleString(locale, { month: "long" });
}
