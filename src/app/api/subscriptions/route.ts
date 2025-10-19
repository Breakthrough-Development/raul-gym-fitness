import { getAuth } from "@/features/auth/queries/get-auth";
import { prisma } from "@/lib/prisma";
import { EstadoMembresia } from "@prisma/client";
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
  const membership =
    (searchParams.get("membership") as EstadoMembresia) || "DIARIO";
  const mode = (searchParams.get("mode") as Mode) || "month";
  const now = new Date();
  const year = toInt(searchParams.get("year"), now.getFullYear());
  const month = toInt(searchParams.get("month"), now.getMonth() + 1); // 1-12

  if (mode === "month") {
    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0, 0);

    const payments = await prisma.pago.findMany({
      where: {
        creado: { gte: start, lt: end },
        estado: "PAGADO",
        membresia: membership,
      },
      select: { creado: true },
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
      series[day - 1].y += 1;
      total += 1;
    }

    const prevStart = new Date(year, month - 2, 1, 0, 0, 0, 0);
    const prevEnd = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const prev = await prisma.pago.count({
      where: {
        creado: { gte: prevStart, lt: prevEnd },
        estado: "PAGADO",
        membresia: membership,
      },
    });

    return NextResponse.json({
      mode,
      year,
      month,
      membership,
      series,
      total,
      prevTotal: prev,
    });
  }

  if (mode === "year") {
    const start = new Date(year, 0, 1, 0, 0, 0, 0);
    const end = new Date(year + 1, 0, 1, 0, 0, 0, 0);
    const payments = await prisma.pago.findMany({
      where: {
        creado: { gte: start, lt: end },
        estado: "PAGADO",
        membresia: membership,
      },
      select: { creado: true },
      orderBy: { creado: "asc" },
    });
    const series = Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 0 }));
    let total = 0;
    for (const p of payments) {
      const m = p.creado.getMonth() + 1;
      series[m - 1].y += 1;
      total += 1;
    }
    const prev = await prisma.pago.count({
      where: {
        creado: { gte: new Date(year - 1, 0, 1), lt: new Date(year, 0, 1) },
        estado: "PAGADO",
        membresia: membership,
      },
    });
    return NextResponse.json({
      mode,
      year,
      membership,
      series,
      total,
      prevTotal: prev,
    });
  }

  const allPayments = await prisma.pago.findMany({
    where: { estado: "PAGADO", membresia: membership },
    select: { creado: true },
    orderBy: { creado: "asc" },
  });
  const map = new Map<number, number>();
  let total = 0;
  for (const p of allPayments) {
    const y = p.creado.getFullYear();
    map.set(y, (map.get(y) ?? 0) + 1);
    total += 1;
  }
  const years = Array.from(map.keys()).sort((a, b) => a - b);
  const series = years.map((y) => ({ x: y, y: map.get(y) ?? 0 }));
  return NextResponse.json({
    mode: "all",
    membership,
    series,
    total,
    prevTotal: 0,
  });
}
