## Component: Header

Fixed, accessible app header with logo and primary navigation.

### Import

```tsx
import Header from "@/components/header";
```

### Behavior

- Fixed to the top with backdrop blur and border
- Uses `Button` with `asChild` to style `Link`s
- Displays app title with a `LucideKanban` icon

### Source

```7:27:src/components/header.tsx
const Header = () => {
  return (
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
            <Button asChild variant="default">
              <Link href={ticketsPath() as Route}>Tickets</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

### Usage

Declared in the root layout so it appears on every page.

```31:33:src/app/layout.tsx
<Header />
<main className="min-h-screen flex-1 ...">{children}</main>
```
