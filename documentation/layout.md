## Layouts in the App Router

This project uses Next.js App Router layouts to define shared UI and metadata.

### Root layout (`src/app/layout.tsx`)

- Provides the HTML scaffold and global UI (header, nav, footer)
- Loads global styles and fonts via `next/font`
- Declares app-wide `metadata`
- Uses centralized path helpers (`src/paths.ts`) for navigation

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { homePath, ticketsPath } from "@/paths";
import type { Route } from "next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
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
}: {
  children: React.ReactNode;
}) {
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
```

Notes:

- `py-24` on `<main>` offsets the fixed header height.
- Navigation uses `homePath()` and `ticketsPath()` from `src/paths.ts`. With `experimental.typedRoutes` enabled, we currently cast to `Route` because helpers return `string`. See `documentation/typed-routes.md` for fully typed helpers to remove the cast.

### Route segment layout (`src/app/tickets/layout.tsx`)

Segment layouts apply to a route and all its nested pages. We customize metadata and add a segment-specific wrapper here.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Tickets page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-slate-400">{children}</div>;
}
```

### Conventions

- Keep global navigation and footer in the root layout.
- Avoid hardcoded `href` strings; use `src/paths.ts`.
- Prefer typed helpers with `Route<...>` to avoid casts (see `documentation/typed-routes.md`).
- Use `next/font` for fonts and load global CSS in the root layout.
- Keep layouts lightweight; defer data fetching to pages or route handlers.

### Our experience

- Centralizing navigation in the root layout simplifies updates across the app.
- Typed routes integrate well, but helpers should be typed to avoid casts.
- Segment layouts are handy for per-section look-and-feel (e.g., the tickets background and metadata).
