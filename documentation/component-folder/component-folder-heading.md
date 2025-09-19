## Component: Heading

Semantic section header with optional description and a separator.

### Import

```tsx
import Heading from "@/components/heading";
```

### Props

- `title` (string, required): Main heading text
- `description` (string, optional): Supporting copy below the title

```3:16:src/components/heading.tsx
interface HeadingProps {
  title: string;
  description?: string;
}

const Heading = ({ title, description }: HeadingProps) => {
  return (
    <>
      <div className="px-8">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
```

### Usage

```tsx
<Heading title="Tickets Page" description="All your tickets at one place." />
```

Renders a heading block followed by a `Separator`.
