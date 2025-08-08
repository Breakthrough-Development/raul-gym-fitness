import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { homePath, ticketsPath } from "@/paths";
import type { Route } from "next";

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
                <Link href={homePath() as Route} className="text-lg font-bold">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={ticketsPath() as Route}
                  className="text-sm underline"
                >
                  Tickets
                </Link>
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
