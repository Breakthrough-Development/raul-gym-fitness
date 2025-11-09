import { prisma } from "@/lib/prisma";
import {
  getCurrentYearMonth,
  getNextYearMonth,
  getPrevYearMonth,
  getUtcMonthRange,
} from "@/utils/date";
import { MembershipStatus, PaymentStatus, Prisma } from "@prisma/client";

export type CohortCandidate = {
  id: string;
  firstName: string;
  phone: string | null;
};

export async function getPreEomCandidates(
  timeZone?: string
): Promise<CohortCandidate[]> {
  const current = getCurrentYearMonth(timeZone);
  const next = getNextYearMonth(current);
  const { start: currentStart, end: currentEnd } = getUtcMonthRange(current);
  const { start: nextStart, end: nextEnd } = getUtcMonthRange(next);

  const where: Prisma.ClientFindManyArgs = {
    where: {
      payments: {
        some: {
          status: PaymentStatus.PAID,
          membership: MembershipStatus.MONTHLY,
          createdAt: { gte: currentStart, lt: currentEnd },
        },
      },
      AND: [
        {
          payments: {
            none: {
              status: PaymentStatus.PAID,
              membership: MembershipStatus.MONTHLY,
              createdAt: { gte: nextStart, lt: nextEnd },
            },
          },
        },
        {
          WhatsappNotification: {
            none: {
              // Use string literal enums to avoid import coupling
              cohort: "PRE_EOM",
              year: current.year,
              month: current.month,
            },
          },
        },
      ],
    },
  };

  const clients = await prisma.client.findMany({
    ...where,
    select: { id: true, firstName: true, phone: true },
  });

  return clients;
}

export async function getPostEomCandidates(
  timeZone?: string
): Promise<CohortCandidate[]> {
  const current = getCurrentYearMonth(timeZone);
  const prev = getPrevYearMonth(current);
  const { start: currentStart, end: currentEnd } = getUtcMonthRange(current);
  const { start: prevStart, end: prevEnd } = getUtcMonthRange(prev);

  const where: Prisma.ClientFindManyArgs = {
    where: {
      payments: {
        some: {
          status: PaymentStatus.PAID,
          membership: MembershipStatus.MONTHLY,
          createdAt: { gte: prevStart, lt: prevEnd },
        },
      },
      AND: [
        {
          payments: {
            none: {
              status: PaymentStatus.PAID,
              membership: MembershipStatus.MONTHLY,
              createdAt: { gte: currentStart, lt: currentEnd },
            },
          },
        },
        {
          WhatsappNotification: {
            none: {
              cohort: "POST_EOM",
              year: current.year,
              month: current.month,
            },
          },
        },
      ],
    },
  };

  const clients = await prisma.client.findMany({
    ...where,
    select: { id: true, firstName: true, phone: true },
  });

  return clients;
}
