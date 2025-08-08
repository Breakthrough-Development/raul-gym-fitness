import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Tickets page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-slate-400">{children}</div>;
}
