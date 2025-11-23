import { getAuth } from "@/features/auth/queries/get-auth";
import { dashboardPath, signInPath } from "@/paths";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Raul Gym Fitness",
  description:
    "Sistema de gestión para gimnasio - Administra clientes, pagos y notificaciones",
};

export default async function HomePage() {
  const auth = await getAuth();

  if (auth.user) {
    redirect(dashboardPath());
  }

  redirect(signInPath());
}
