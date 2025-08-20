# Client-Server Composition Patterns

This document explains design patterns for composing Server and Client Components in Next.js, particularly how to use Server Components within Client Component ancestors through component composition.

## Overview

While the client-server boundary normally flows one way (Server Components can import Client Components, but not vice versa), there are composition patterns that allow Server Components to be used within Client Component trees. This is crucial for maintaining performance while adding interactivity.

## The Core Problem

When a component becomes a Client Component (via `"use client"` or inheritance), all its children automatically become Client Components too. This can lead to unnecessary JavaScript bundle bloat and loss of server-side benefits.

```typescript
// ❌ Problem: Everything becomes Client Component
"use client";
export function InteractivePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ExpensiveStaticContent /> {/* Now unnecessarily client-side */}
      <DatabaseContent /> {/* Now unnecessarily client-side */}
      <InteractiveWidget isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
```

## Solution: Component Composition

The key design pattern is **Component Composition** - passing Server Components as children or props to Client Components, allowing them to remain as Server Components.

### 🔑 Composition: The Exception to Inheritance Rules

**Normal Inheritance Rule**: When a component is a Client Component, ALL its children automatically become Client Components.

**Composition Exception**: When Server Components are passed as `children` or props to Client Components, they remain Server Components because they are **rendered by the parent**, not the Client Component itself.

```typescript
// ❌ Normal inheritance - children become Client Components
"use client";
export function ClientPage() {
  return (
    <div>
      <ServerComponent /> {/* ❌ Becomes Client Component due to inheritance */}
    </div>
  );
}

// ✅ Composition exception - children stay Server Components
("use client");
export function ClientWrapper({ children }) {
  return (
    <div className="wrapper">
      {children} {/* ✅ Stays Server Component - rendered by parent */}
    </div>
  );
}

// Usage: Server Component parent renders and passes children
export default function ServerPage() {
  return (
    <ClientWrapper>
      <ServerComponent /> {/* ✅ Rendered by ServerPage, stays Server */}
    </ClientWrapper>
  );
}
```

**Why this works**:

- `<ServerComponent />` is **instantiated and rendered** by `ServerPage` (Server Component)
- `ClientWrapper` only receives the **already-rendered result** as props
- The Client Component never directly imports or renders the Server Component
- React treats the `children` as pre-rendered content, preserving its server nature

### Understanding the Exception Rules

The composition exception applies when:

| ✅ **Exception Applies (Server Components stay Server)** | ❌ **Exception Doesn't Apply (Becomes Client)** |
| -------------------------------------------------------- | ----------------------------------------------- |
| `<ClientComp>{serverContent}</ClientComp>`               | `<ClientComp><ServerComp /></ClientComp>`       |
| Passed as `children` prop                                | Directly imported and rendered                  |
| Passed as custom props (slots)                           | Instantiated inside Client Component            |
| Pre-rendered by Server Component parent                  | Component reference passed as prop              |

```typescript
// ✅ EXCEPTION APPLIES - Server Component stays Server
export function ServerPage() {
  return (
    <ClientWrapper>
      <ServerComponent />          {/* ✅ Rendered here, stays Server */}
    </ClientWrapper>
  );
}

// ❌ EXCEPTION DOESN'T APPLY - Becomes Client Component
"use client";
import ServerComponent from './ServerComponent';

export function ClientPage() {
  return (
    <div>
      <ServerComponent />          {/* ❌ Imported directly, becomes Client */}
    </div>
  );
}

// ✅ EXCEPTION APPLIES - Slot pattern
export function ServerPage() {
  return (
    <ClientModal
      header={<ServerHeader />}    {/* ✅ Pre-rendered, stays Server */}
      content={<ServerContent />}  {/* ✅ Pre-rendered, stays Server */}
    />
  );
}

// ❌ EXCEPTION DOESN'T APPLY - Component reference
export function ServerPage() {
  return (
    <ClientWrapper
      component={ServerComponent}  {/* ❌ Component reference, becomes Client */}
    />
  );
}
```

**Key Principle**: The exception only works when the Server Component is **rendered/instantiated** by a Server Component and **passed as JSX/ReactNode** to the Client Component. If the Client Component itself instantiates the component, it becomes a Client Component.

### Pattern 1: Children Composition

Pass Server Components as `children` to Client Components:

```typescript
// Client Component wrapper
"use client";
export function InteractiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Content</button>
      {isOpen && children} {/* Server Components passed as children */}
    </div>
  );
}

// Usage: Server Components remain server-side
export default function Page() {
  return (
    <InteractiveWrapper>
      <ExpensiveStaticContent /> {/* Stays Server Component */}
      <DatabaseContent /> {/* Stays Server Component */}
    </InteractiveWrapper>
  );
}
```

### Pattern 2: Slot-based Composition

Pass Server Components as specific props (slots):

```typescript
// Client Component with slots
"use client";
export function Modal({
  header,
  content,
  footer
}: {
  header: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-header">{header}</div>
      <div className="modal-content">{content}</div>
      <div className="modal-footer">{footer}</div>
      <button onClick={() => setIsOpen(false)}>Close</button>
    </div>
  );
}

// Usage: Each slot can be a Server Component
export default function Page() {
  return (
    <Modal
      header={<ServerRenderedHeader />}     {/* Server Component */}
      content={<DatabaseContent />}         {/* Server Component */}
      footer={<StaticFooter />}            {/* Server Component */}
    />
  );
}
```

## Real Examples from Our Codebase

### Example 1: Theme Provider Composition

Our application demonstrates this pattern with the `ThemeProvider`:

```typescript
// src/components/theme/theme-provider.tsx - Client Component
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

// src/app/layout.tsx - Server Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {" "}
          {/* Client Component wrapper */}
          <Header /> {/* Server Component - stays server */}
          <main>{children}</main> {/* Can be Server or Client */}
          <footer>
            {" "}
            {/* Server Component - stays server */}
            <p>&copy; 2024 The Road to Next</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Why this works**:

- `ThemeProvider` is a Client Component (needs React Context)
- `Header`, `main`, and `footer` are passed as children
- These children remain Server Components and get their benefits
- Only the theme context logic runs on the client

**🔑 This is the composition exception in action**:

```typescript
// The inheritance rule would suggest:
<ThemeProvider>
  {" "}
  {/* Client Component */}
  <Header /> {/* ❌ Should become Client Component by inheritance */}
  <footer /> {/* ❌ Should become Client Component by inheritance */}
</ThemeProvider>

// But composition exception applies because:
// 1. RootLayout (Server Component) renders <Header /> and <footer />
// 2. These are passed as children to ThemeProvider
// 3. ThemeProvider receives pre-rendered JSX, not component references
// 4. Therefore Header and footer remain Server Components ✅
```

**Without composition, we'd have to do**:

```typescript
// ❌ This would make everything Client Components
"use client";
import Header from "@/components/header";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <Header /> {/* ❌ Now Client Component - unnecessary */}
      <main>{children}</main>
      <footer /> {/* ❌ Now Client Component - unnecessary */}
    </ThemeProvider>
  );
}
```

### Example 2: Header with Mixed Components

The header demonstrates selective client-side functionality:

```typescript
// src/components/header.tsx - Server Component
const Header = () => {
  return (
    <header>
      <nav>
        <Button asChild variant="ghost">
          {" "}
          {/* Server Component */}
          <Link href="/">
            {" "}
            {/* Server Component */}
            <LucideKanban /> {/* Server Component */}
            <h1>TicketBounty</h1> {/* Server Component */}
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <ThemeSwitcher /> {/* Client Component - isolated */}
          <Button asChild variant="default">
            <Link href="/tickets">Tickets</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};
```

**Key insights**:

- Most of the header remains a Server Component
- Only `ThemeSwitcher` needs client-side functionality
- No composition needed here because the boundary is clear

## Advanced Composition Patterns

### Pattern 3: Provider Composition

Stacking multiple providers while maintaining server components:

```typescript
// Multiple Client Component providers
"use client";
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Usage maintains server components
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          <ServerHeader /> {/* Server Component */}
          <main>{children}</main> {/* Server or Client based on page */}
          <ServerFooter /> {/* Server Component */}
        </AppProviders>
      </body>
    </html>
  );
}
```

### Pattern 4: Conditional Composition

Conditionally rendering Server Components based on client state:

```typescript
// Client Component with conditional rendering
"use client";
export function ConditionalWrapper({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  return (
    <div>
      {isLoaded ? children : fallback}
    </div>
  );
}

// Usage with Server Components
export default function Page() {
  return (
    <ConditionalWrapper
      fallback={<LoadingSpinner />}      {/* Server Component */}
    >
      <ExpensiveContent />               {/* Server Component */}
    </ConditionalWrapper>
  );
}
```

### Pattern 5: Event Handler Composition

Passing server-generated content with client-side event handling:

```typescript
// Client Component handling events
"use client";
export function InteractiveCard({
  children,
  onAction,
}: {
  children: React.ReactNode;
  onAction: () => void;
}) {
  return (
    <div className="card" onClick={onAction}>
      {children}
    </div>
  );
}

// Server Component generating content
async function ServerGeneratedContent() {
  const data = await fetchFromDatabase();
  return (
    <div>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
    </div>
  );
}

// Usage combining both
("use client");
export default function InteractivePage() {
  const handleClick = () => {
    console.log("Card clicked!");
  };

  return (
    <InteractiveCard onAction={handleClick}>
      <ServerGeneratedContent /> {/* Server Component content */}
    </InteractiveCard>
  );
}
```

## Benefits of Composition Patterns

### 1. **Performance Optimization**

- Reduces JavaScript bundle size
- Keeps static content server-rendered
- Minimizes hydration overhead

### 2. **SEO Benefits**

- Server Components remain searchable
- Content is available in initial HTML
- Faster First Contentful Paint (FCP)

### 3. **Development Experience**

- Clear separation of concerns
- Easier to reason about component boundaries
- Better debugging (server vs client issues are isolated)

### 4. **Flexibility**

- Mix server and client components as needed
- Easy to migrate between patterns
- Supports gradual adoption of interactivity

## Common Composition Scenarios

### Scenario 1: Interactive Shell with Static Content

```typescript
"use client";
export function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar isOpen={sidebarOpen} />
      <main className="content">
        {children} {/* Static dashboard content */}
      </main>
    </div>
  );
}
```

### Scenario 2: Form with Server-Generated Options

```typescript
"use client";
export function InteractiveForm({ children }) {
  const [formData, setFormData] = useState({});

  return (
    <form onSubmit={handleSubmit}>
      {children} {/* Server-generated form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}

// Server Component generates form fields
async function FormFields() {
  const options = await getSelectOptions();
  return (
    <>
      <input name="title" />
      <select name="category">
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
```

## Best Practices

### 1. **Identify the Minimal Interactive Surface**

Only make components client-side when they absolutely need interactivity:

```typescript
// ✅ Good: Minimal client component
"use client";
export function ToggleButton({ children }) {
  const [isToggled, setIsToggled] = useState(false);
  return <button onClick={() => setIsToggled(!isToggled)}>{children}</button>;
}

// ❌ Bad: Unnecessary client component
("use client");
export function UnnecessaryClientComponent({ title, content }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}
```

### 2. **Use Composition Over Inheritance**

Prefer passing components as props/children rather than importing them:

```typescript
// ✅ Good: Composition
export function ClientWrapper({ serverContent }) {
  return <div className="wrapper">{serverContent}</div>;
}

// ❌ Bad: Direct import
("use client");
import ServerComponent from "./ServerComponent"; // This won't work as expected

export function ClientWrapper() {
  return (
    <div className="wrapper">
      <ServerComponent /> {/* Now becomes client component */}
    </div>
  );
}
```

### 3. **Design Component APIs for Composition**

Structure your components to accept rendered content:

```typescript
// Good API design for composition
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode; // Can be server-rendered
  content: React.ReactNode; // Can be server-rendered
  actions: React.ReactNode; // Can be server-rendered
};
```

## Summary

Component composition is the key design pattern for using Server Components within Client Component ancestors. This pattern allows you to:

1. **Maintain performance benefits** of Server Components
2. **Add interactivity** where needed through Client Components
3. **Create flexible, reusable** component architectures
4. **Optimize bundle size** by keeping static content server-side

The pattern works by passing Server Components as `children` or props to Client Components, allowing them to remain server-rendered while still being part of an interactive component tree. Our application demonstrates this with the `ThemeProvider` wrapping server-rendered layout components, showing how to achieve both theming functionality and server-side performance benefits.
