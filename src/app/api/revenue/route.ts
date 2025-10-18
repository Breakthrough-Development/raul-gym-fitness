import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Mode = "month" | "year" | "all";

function toInt(value: string | null, fallback: number): number {
  const n = value ? Number.parseInt(value, 10) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: NextRequest) {
  const { user } = await getAuth();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") as Mode) || "month";
  const now = new Date();
  const year = toInt(searchParams.get("year"), now.getFullYear());
  const month = toInt(searchParams.get("month"), now.getMonth() + 1); // 1-12

  if (mode === "month") {
    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0, 0);

    const payments = await prisma.payment.findMany({
      where: { createdAt: { gte: start, lt: end }, status: "PAID" },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const series = Array.from({ length: daysInMonth }, (_, i) => ({
      x: i + 1,
      y: 0,
    }));
    let total = 0;
    for (const p of payments) {
      const day = p.createdAt.getDate();
      series[day - 1].y += p.amount;
      total += p.amount;
    }

    // previous month for delta
    const prevStart = new Date(year, month - 2, 1, 0, 0, 0, 0);
    const prevEnd = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const prev = await prisma.payment.aggregate({
      where: { createdAt: { gte: prevStart, lt: prevEnd }, status: "PAID" },
      _sum: { amount: true },
    });
    const prevTotal = prev._sum.amount ?? 0;

    return NextResponse.json({
      mode,
      year,
      month,
      series,
      total,
      prevTotal,
    });
  }

  if (mode === "year") {
    const start = new Date(year, 0, 1, 0, 0, 0, 0);
    const end = new Date(year + 1, 0, 1, 0, 0, 0, 0);
    const payments = await prisma.payment.findMany({
      where: { createdAt: { gte: start, lt: end }, status: "PAID" },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const series = Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 0 }));
    let total = 0;
    for (const p of payments) {
      const m = p.createdAt.getMonth() + 1;
      series[m - 1].y += p.amount;
      total += p.amount;
    }
    const prev = await prisma.payment.aggregate({
      where: {
        createdAt: { gte: new Date(year - 1, 0, 1), lt: new Date(year, 0, 1) },
        status: "PAID",
      },
      _sum: { amount: true },
    });
    const prevTotal = prev._sum.amount ?? 0;
    return NextResponse.json({ mode, year, series, total, prevTotal });
  }

  // all: group by year across all data
  const allPayments = await prisma.payment.findMany({
    where: { status: "PAID" },
    select: { amount: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  const map = new Map<number, number>();
  let total = 0;
  for (const p of allPayments) {
    const y = p.createdAt.getFullYear();
    map.set(y, (map.get(y) ?? 0) + p.amount);
    total += p.amount;
  }
  const years = Array.from(map.keys()).sort((a, b) => a - b);
  const series = years.map((y) => ({ x: y, y: map.get(y) ?? 0 }));
  const prevTotal = 0; // not meaningful for all-time
  return NextResponse.json({ mode: "all", series, total, prevTotal });
}
