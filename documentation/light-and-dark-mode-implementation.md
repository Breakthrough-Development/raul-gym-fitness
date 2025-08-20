# Light and Dark Mode Implementation

This document outlines the implementation of light and dark mode functionality in our Next.js application using the `next-themes` library.

## Overview

We implemented a theme switching system that allows users to toggle between light and dark modes. The implementation follows best practices for Next.js applications and provides a smooth user experience with proper hydration handling.

## Dependencies Added

### next-themes

- **Package**: `next-themes@^0.4.6`
- **Purpose**: Provides a simple and powerful theme management system for Next.js applications
- **Why chosen**:
  - Built specifically for Next.js with proper SSR support
  - Handles hydration mismatches automatically
  - Supports system theme detection
  - Minimal bundle size impact

## File Structure

We keep the provider and switcher in the `components/theme/` folder due to them being commonly shared through projects. Unlike the features folder, this is more for domain-agnostic components that can be reused across different applications.

```
src/components/theme/
├── theme-provider.tsx    # Theme context provider
└── theme-switcher.tsx    # Theme toggle button component
```

## Implementation Details

### 1. Theme Provider (`src/components/theme/theme-provider.tsx`)

**What it does**: Wraps the application with theme context, enabling theme switching throughout the component tree.

**Key features**:

- Uses `next-themes` ThemeProvider as the base
- Configures `attribute="class"` to use CSS classes for theme switching
- Sets `defaultTheme="system"` to respect user's system preference
- Enables `enableSystem` to automatically detect system theme changes

```typescript
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

**Why this approach**:

- Class-based theming integrates seamlessly with Tailwind CSS
- System theme detection provides better UX
- Automatic theme persistence across sessions

### 2. Theme Switcher (`src/components/theme/theme-switcher.tsx`)

**What it does**: Provides a button interface for users to toggle between light and dark themes.

**Key features**:

- Uses `useTheme` hook from `next-themes` to access theme state
- Toggles between "light" and "dark" themes (system preference handled automatically)
- Animated icons using Lucide React icons with Tailwind transitions
- Accessible with screen reader support

**Icon Animation**:

- Sun icon: Visible in light mode, rotates and scales out in dark mode
- Moon icon: Hidden in light mode, rotates and scales in during dark mode
- Smooth transitions using Tailwind's `transition-all` and `transition-transform`

**Why this design**:

- Clear visual feedback with intuitive sun/moon iconography
- Smooth animations enhance user experience
- Accessibility considerations with screen reader labels

### 3. Layout Integration (`src/app/layout.tsx`)

**Changes made**:

1. **Added ThemeProvider import**:

   ```typescript
   import { ThemeProvider } from "@/components/theme/theme-provider";
   ```

2. **Wrapped application with ThemeProvider**:

   ```tsx
   <ThemeProvider>
     <Header />
     <main>...</main>
     <footer>...</footer>
   </ThemeProvider>
   ```

3. **Added suppressHydrationWarning to html tag**:
   ```tsx
   <html lang="en" suppressHydrationWarning>
   ```

**Why these changes**:

- Provider placement ensures theme context is available to all components
- `suppressHydrationWarning` prevents Next.js hydration warnings that occur due to server/client theme differences
- Wrapping the entire app (including header and footer) ensures consistent theming

### 4. Header Integration (`src/components/header.tsx`)

**Changes made**:

1. **Added ThemeSwitcher import**:

   ```typescript
   import { ThemeSwitcher } from "./theme/theme-switcher";
   ```

2. **Added ThemeSwitcher to navigation**:
   ```tsx
   <div className="flex items-center gap-2">
     <li>
       <ThemeSwitcher />
     </li>
     <li>
       <Button asChild variant="default">
         <Link href={ticketsPath() as Route}>Tickets</Link>
       </Button>
     </li>
   </div>
   ```

**Why this placement**:

- Header is persistent across all pages
- Natural location for global UI controls
- Maintains consistent access to theme switching

## How It Works

1. **Initialization**: On app load, `next-themes` detects the user's system theme preference or uses the stored preference from localStorage

2. **Theme Application**: The theme is applied by adding/removing the `dark` class to the document element, which Tailwind CSS uses to apply dark mode styles

3. **Theme Switching**: When user clicks the theme switcher:

   - Current theme is toggled between "light" and "dark"
   - New theme preference is stored in localStorage
   - CSS classes are updated immediately
   - Icons animate to reflect the new state

4. **Persistence**: Theme preference persists across browser sessions via localStorage

5. **System Theme Integration**: If user has "system" theme selected, the app automatically responds to system theme changes

## Benefits of This Implementation

1. **Performance**: Minimal runtime overhead with efficient theme switching
2. **Accessibility**: Proper ARIA labels and keyboard navigation support
3. **User Experience**: Smooth animations and respect for system preferences
4. **Developer Experience**: Simple API with TypeScript support
5. **SEO Friendly**: Proper SSR handling without hydration issues
6. **Maintainable**: Clean separation of concerns with reusable components

## Tailwind CSS Integration

The implementation leverages Tailwind's built-in dark mode support using the `class` strategy. Dark mode styles are applied using the `dark:` prefix:

```css
/* Example usage in components */
.bg-background/* Light mode background */
.dark: bg-background;
.dark
.dark/* Dark mode background */;
```

This approach provides:

- Consistent theming across all components
- Easy maintenance and updates
- Performance benefits (no runtime CSS-in-JS overhead)
- Full design system integration
