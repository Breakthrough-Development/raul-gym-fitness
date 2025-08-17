import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { homePath, ticketsPath } from "@/paths";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { LucideKanban } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Road to Next",
  description: "A journey through the Next.js ecosystem by Royer Adames",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <nav>
            <ul className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between">
              <li>
                <Button asChild variant="ghost">
                  <Link href={homePath() as Route}>
                    <LucideKanban />
                    <h1 className="text-lg font-bold">TicketBounty</h1>
                  </Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="outline">
                  <Link href={ticketsPath() as Route}>Tickets</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </header>
        <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden py-24 px-8 bg-secondary/20 flex flex-col">
          {children}
        </main>
        <footer>
          <p>
            &copy; {new Date().getFullYear()} The Road to Next. All rights
            reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
