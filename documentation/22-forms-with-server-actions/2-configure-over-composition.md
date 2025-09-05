## Configuration over Composition

A software craftsmanship principle that favors making components configurable through properties rather than building complex component hierarchies.

### TL;DR

- Configuration: one flexible component controlled by props (fast, consistent).
- Composition: combine small components (flexible, more moving parts).
- Start with configuration for simple/consistent UIs; switch to composition when you need custom structure or behavior.
- A hybrid (configurable parts that can be composed) is often best.

### What is Configuration?

**Configuration** means changing component behavior through properties, options, or parameters without modifying the component's internal structure.

```typescript
// Configuration approach - one flexible component
<Button variant="primary" size="large" disabled={loading} onClick={handleClick}>
  Submit
</Button>
```

**Characteristics:**

- Single component with many options
- Behavior changed through props/parameters
- Centralized logic in one place
- Easy to maintain and update

### What is Composition?

**Composition** means building complex functionality by combining multiple smaller, focused components together.

```typescript
// Composition approach - multiple components combined
<ButtonContainer>
  <ButtonIcon icon="check" />
  <ButtonText>Submit</ButtonText>
  <ButtonSpinner visible={loading} />
</ButtonContainer>
```

**Characteristics:**

- Multiple small, focused components
- Behavior emerges from combination
- Distributed logic across components
- Maximum flexibility but more complex

### Configuration vs Composition Comparison

| Aspect             | Configuration                 | Composition                        |
| ------------------ | ----------------------------- | ---------------------------------- |
| **Complexity**     | Lower - fewer moving parts    | Higher - many components           |
| **Flexibility**    | Limited to predefined options | Unlimited - any combination        |
| **Maintenance**    | Easier - centralized logic    | Harder - distributed logic         |
| **Learning Curve** | Gentler - fewer concepts      | Steeper - understand all parts     |
| **Performance**    | Better - fewer components     | Potentially slower - more overhead |
| **Customization**  | Limited to provided props     | Complete control over structure    |

###

### Real-World Example: Form Components

#### Configuration Approach

```typescript
// Single configurable form component
<Form
  fields={[
    { name: "title", type: "text", required: true },
    { name: "content", type: "textarea", required: true },
  ]}
  action={createTicket}
  submitText="Create Ticket"
  layout="vertical"
  showReset={true}
/>
```

**Pros:**

- Quick to implement
- Consistent styling
- Less code to write
- Built-in validation

**Cons:**

- Limited to predefined field types
- Hard to add custom behavior
- Can become bloated with options

#### Composition Approach (Our Current Implementation)

```typescript
// Multiple components composed together
<form action={createTicket} className="flex flex-col gap-y-2">
  <Label htmlFor="title">Title</Label>
  <Input id="title" name="title" type="text" />

  <Label htmlFor="content">Content</Label>
  <Textarea id="content" name="content" />

  <Button type="submit">Create</Button>
</form>
```

**Pros:**

- Complete customization
- Reusable components
- Easy to add new field types
- Clear component boundaries

**Cons:**

- More verbose
- Potential inconsistency
- Requires understanding all components

### When to Use Each Approach

#### Choose Configuration When:

- **Rapid development** - Need to build quickly
- **Consistent UI** - Want uniform appearance
- **Limited variations** - Predefined options cover most cases
- **Team consistency** - Prevent design divergence
- **Simple use cases** - Basic functionality is sufficient

#### Choose Composition When:

- **Maximum flexibility** - Need custom combinations
- **Unique designs** - Each instance looks different
- **Complex requirements** - Standard options aren't enough
- **Component reusability** - Want to use parts elsewhere
- **Long-term maintainability** - Prefer smaller, focused components

### Hybrid Approach

Often the best solution combines both:

```typescript
// Configurable components that can be composed
<Form action={createTicket} layout="vertical">
  <Input name="title" variant="outlined" required />
  <Textarea name="content" variant="outlined" rows={4} />
  <Button type="submit" variant="primary" size="large">
    Create Ticket
  </Button>
</Form>
```

This gives you:

- **Configuration** within each component (variant, size, etc.)
- **Composition** at the form level (choose which components to include)

### Our Form Implementation Analysis

Our current ticket form uses **composition**:

```typescript
<form action={createTicket} className="flex flex-col gap-y-2">
  <Label htmlFor="title">Title</Label>
  <Input id="title" name="title" type="text" />

  <Label htmlFor="content">Content</Label>
  <Textarea id="content" name="content" />

  <Button type="submit">Create</Button>
</form>
```

**Why this works well:**

- Clear separation of concerns
- Each component has a single responsibility
- Easy to modify individual parts
- Leverages our UI component library
- Follows HTML semantic structure

### Key Takeaway

**"Configuration over Composition"** suggests preferring simpler, configurable components when they meet your needs, but don't be afraid to use composition when you need the flexibility. The best approach depends on your specific requirements and constraints.

In our ticket form, composition provides the right balance of flexibility and maintainability for our current needs.

### Practical checklist

- If choosing configuration:
  - Prefer a small set of well-named props (avoid prop explosion).
  - Provide sensible defaults and accessible variants.
  - Document limits clearly so teams know when to switch to composition.
- If choosing composition:
  - Keep components small with single responsibility.
  - Share styles/tokens to avoid inconsistent UIs.
  - Extract common patterns into reusable composites when they repeat.

Aim for a hybrid when it keeps code simple without blocking needed flexibility.
