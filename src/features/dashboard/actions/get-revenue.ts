"use server";

import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";

type Mode = "month" | "year" | "all";

type RevenueParams = {
  mode?: Mode;
  year?: number;
  month?: number;
};

type RevenueResponse =
  | {
      mode: "month";
      year: number;
      month: number;
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    }
  | {
      mode: "year";
      year: number;
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    }
  | {
      mode: "all";
      series: { x: number; y: number }[];
      total: number;
      prevTotal: number;
    };

function toInt(value: number | undefined, fallback: number): number {
  const n = value ?? NaN;
  return Number.isFinite(n) ? n : fallback;
}

export async function getRevenue(
  params: RevenueParams
): Promise<RevenueResponse> {
  const { user } = await getAuth();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const mode = params.mode || "month";
  const now = new Date();
  const year = toInt(params.year, now.getFullYear());
  const month = toInt(params.month, now.getMonth() + 1); // 1-12

  if (mode === "month") {
    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0, 0);

    const payments = await prisma.pago.findMany({
      where: { creado: { gte: start, lt: end }, estado: "PAGADO" },
      select: { monto: true, creado: true },
      orderBy: { creado: "asc" },
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const series = Array.from({ length: daysInMonth }, (_, i) => ({
      x: i + 1,
      y: 0,
    }));
    let total = 0;
    for (const p of payments) {
      const day = p.creado.getDate();
      series[day - 1].y += p.monto;
      total += p.monto;
    }

    // previous month for delta
    const prevStart = new Date(year, month - 2, 1, 0, 0, 0, 0);
    const prevEnd = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const prev = await prisma.pago.aggregate({
      where: { creado: { gte: prevStart, lt: prevEnd }, estado: "PAGADO" },
      _sum: { monto: true },
    });
    const prevTotal = prev._sum.monto ?? 0;

    return {
      mode,
      year,
      month,
      series,
      total,
      prevTotal,
    };
  }

  if (mode === "year") {
    const start = new Date(year, 0, 1, 0, 0, 0, 0);
    const end = new Date(year + 1, 0, 1, 0, 0, 0, 0);
    const payments = await prisma.pago.findMany({
      where: { creado: { gte: start, lt: end }, estado: "PAGADO" },
      select: { monto: true, creado: true },
      orderBy: { creado: "asc" },
    });
    const series = Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 0 }));
    let total = 0;
    for (const p of payments) {
      const m = p.creado.getMonth() + 1;
      series[m - 1].y += p.monto;
      total += p.monto;
    }
    const prev = await prisma.pago.aggregate({
      where: {
        creado: { gte: new Date(year - 1, 0, 1), lt: new Date(year, 0, 1) },
        estado: "PAGADO",
      },
      _sum: { monto: true },
    });
    const prevTotal = prev._sum.monto ?? 0;
    return { mode, year, series, total, prevTotal };
  }

  // all: group by year across all data
  const allPayments = await prisma.pago.findMany({
    where: { estado: "PAGADO" },
    select: { monto: true, creado: true },
    orderBy: { creado: "asc" },
  });
  const map = new Map<number, number>();
  let total = 0;
  for (const p of allPayments) {
    const y = p.creado.getFullYear();
    map.set(y, (map.get(y) ?? 0) + p.monto);
    total += p.monto;
  }
  const years = Array.from(map.keys()).sort((a, b) => a - b);
  const series = years.map((y) => ({ x: y, y: map.get(y) ?? 0 }));
  const prevTotal = 0; // not meaningful for all-time
  return { mode: "all", series, total, prevTotal };
}
