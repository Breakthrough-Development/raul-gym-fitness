import Header from "@/components/header";
import { Toaster } from "@/components/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Sidebar } from "./_navigation/sidebar/sidebar";
import { ReactQueryProvider } from "./_providers/react-query/react-query-provider";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <NuqsAdapter>
            <ThemeProvider>
              <SidebarProvider className="flex-col" defaultOpen={false}>
                <Header />
                <div className="flex min-h-svh border-collapse">
                  <Sidebar />
                  <main className="flex-1 py-24 px-8 bg-secondary/20 flex flex-col">
                    {children}
                  </main>
                </div>
                <footer className="flex justify-center p-4">
                  <p>
                    &copy; {new Date().getFullYear()} Breakthrough Development
                    Group, LLC. All rights reserved.
                  </p>
                </footer>
                <Toaster expand />
              </SidebarProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
