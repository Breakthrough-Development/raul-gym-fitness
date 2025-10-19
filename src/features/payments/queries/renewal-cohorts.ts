import { prisma } from "@/lib/prisma";
import {
  getCurrentYearMonth,
  getNextYearMonth,
  getPrevYearMonth,
  getUtcMonthRange,
} from "@/utils/date";
import { EstadoMembresia, EstadoPago, Prisma } from "@prisma/client";

export type CohortCandidate = {
  id: string;
  nombre: string;
  telefono: string | null;
};

export async function getPreEomCandidates(
  timeZone?: string
): Promise<CohortCandidate[]> {
  const current = getCurrentYearMonth(timeZone);
  const next = getNextYearMonth(current);
  const { start: currentStart, end: currentEnd } = getUtcMonthRange(current);
  const { start: nextStart, end: nextEnd } = getUtcMonthRange(next);

  const where: Prisma.ClienteFindManyArgs = {
    where: {
      Pago: {
        some: {
          estado: EstadoPago.PAGADO,
          membresia: EstadoMembresia.MENSUAL,
          creado: { gte: currentStart, lt: currentEnd },
        },
      },
      AND: [
        {
          Pago: {
            none: {
              estado: EstadoPago.PAGADO,
              membresia: EstadoMembresia.MENSUAL,
              creado: { gte: nextStart, lt: nextEnd },
            },
          },
        },
        {
          // @ts-expect-error relation filter on WhatsappNotification exists in schema at runtime
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

  const clients = await prisma.cliente.findMany({
    ...where,
    select: { id: true, nombre: true, telefono: true },
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

  const where: Prisma.ClienteFindManyArgs = {
    where: {
      Pago: {
        some: {
          estado: EstadoPago.PAGADO,
          membresia: EstadoMembresia.MENSUAL,
          creado: { gte: prevStart, lt: prevEnd },
        },
      },
      AND: [
        {
          Pago: {
            none: {
              estado: EstadoPago.PAGADO,
              membresia: EstadoMembresia.MENSUAL,
              creado: { gte: currentStart, lt: currentEnd },
            },
          },
        },
        {
          // @ts-expect-error relation filter on WhatsappNotification exists in schema at runtime
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

  const clients = await prisma.cliente.findMany({
    ...where,
    select: { id: true, nombre: true, telefono: true },
  });

  return clients;
}
