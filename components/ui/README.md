# COMMONS YOUTH UI Component Library

Design system components following the **COMMONS YOUTH Brand Identity Guidelines (2026)**.

## 📦 Components

### Button
Monochrome button component following design system guidelines.

```tsx
import { Button } from './components/ui';

<Button variant="primary" size="md" icon={MapPin} iconPosition="right">
  Click Me
</Button>
```

**Variants:**
- `primary` - Black background, white text (default)
- `secondary` - White background, black border
- `outline` - Transparent with black border
- `danger` - Orange border, hover fill

**Sizes:** `sm` | `md` | `lg`

**Props:**
- `icon` - Lucide icon component
- `iconPosition` - `'left'` | `'right'`
- `loading` - Shows loading spinner
- `fullWidth` - Expands to full width

### Badge
Accent badge component with PT Mono support.

```tsx
import { Badge } from './components/ui';

<Badge variant="primary" mono size="md">
  200+
</Badge>
```

**Variants:**
- `default` - Linen background
- `primary` - Bud green
- `secondary` - Ocean blue
- `success` - Forest green
- `warning` - Morning yellow
- `danger` - Orange
- `outline` - Transparent with border

**Sizes:** `sm` | `md` | `lg`

**Props:**
- `mono` - Use PT Mono font for numeric/accent content
- `icon` - Lucide icon component

### Card
Flexible card component with multiple variants.

```tsx
import { Card, BrowserCard } from './components/ui';

<Card variant="elevated" padding="lg">
  Content here
</Card>

<BrowserCard url="commons-youth.org/groups/123">
  Browser-style content
</BrowserCard>
```

**Variants:**
- `default` - Basic card with border
- `elevated` - With retro shadow effect
- `outlined` - Transparent background
- `browser` - Browser-style (use BrowserCard component)

**Padding:** `none` | `sm` | `md` | `lg`

### Typography
Type-safe typography components following hierarchy.

```tsx
import { Heading, Subheading, BodyText, Caption, AccentText } from './components/ui';

<Heading className="text-4xl">MAIN TITLE</Heading>
<Subheading className="text-2xl">Subheader</Subheading>
<BodyText>Body text with proper leading</BodyText>
<Caption>Caption text</Caption>
<AccentText className="text-3xl">123</AccentText>
```

**Components:**
- `Heading` - Anuphan Bold, ALL CAPS, primary headings
- `Subheading` - Anuphan Semibold, 65% of heading size
- `BodyText` - Anuphan Regular, 42% of heading, +2pt leading
- `Caption` - Anuphan Light, 78.85% of body
- `AccentText` - PT Mono for numeric and special emphasis

### Form Components

#### Input
```tsx
import { Input } from './components/ui';

<Input
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  error="This field is required"
  helperText="We'll never share your email"
  required
/>
```

#### Textarea
```tsx
import { Textarea } from './components/ui';

<Textarea
  label="Description"
  placeholder="Tell us about your group..."
  helperText="Maximum 500 characters"
  required
/>
```

#### Select
```tsx
import { Select } from './components/ui';

<Select
  label="Select Province"
  options={[
    { value: 'bkk', label: 'กรุงเทพมหานคร' },
    { value: 'cnx', label: 'เชียงใหม่' },
  ]}
  required
/>
```

#### Checkbox
```tsx
import { Checkbox } from './components/ui';

<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>
```

## Design System Principles

### Color Distribution (60-30-10 Rule)
- **60%** Base colors (Linen `#FAF6E2` / Obsidian `#161716`)
- **30%** Brand colors (Bud Green, Burnt Orange, Amber Brown)
- **10%** Accent/Topic colors (Forest, Ocean, Raspberry, etc.)

### Typography Hierarchy
- **Main Heading**: Anuphan Bold, ALL CAPS, +4pt leading
- **Subheader**: Anuphan Semibold, 65% of heading size
- **Body Text**: Anuphan Regular, 42% of heading, +2pt leading
- **Caption**: Anuphan Light, 78.85% of body
- **Accent**: PT Mono for numeric and special emphasis

### Button Guidelines
- Use **monochrome backgrounds** (Black/White) only
- Apply `shadow-retro` effect for brand consistency
- Hover states can use brand colors

### Font Weights
- Light: 300 (Caption)
- Regular: 400 (Body)
- Semibold: 600 (Subheader)
- Bold: 700 (Heading)

## Custom Tailwind Classes

```css
text-subheader    /* 1.463rem, 65% of heading */
text-body-ds      /* 0.945rem, 42% of heading, +2pt leading */
text-caption-ds   /* 0.745rem, 78.85% of body */

shadow-retro      /* 4px 4px 0px rgba(22, 23, 22, 0.15) */
shadow-retro-sm   /* 2px 2px 0px */

font-mono         /* PT Mono */
font-sans         /* Anuphan (default) */
```

## Usage Examples

### Feature Card
```tsx
<div className="bg-white p-8 rounded-2xl border-2 border-brand-obsidian shadow-retro">
  <Badge variant="primary" mono>01</Badge>
  <Subheading className="mt-4 mb-2">Feature Title</Subheading>
  <BodyText className="text-brand-earth">Description text here</BodyText>
  <Button variant="secondary" size="sm" className="mt-4">
    Learn More
  </Button>
</div>
```

### Stat Display
```tsx
<div className="text-center">
  <AccentText className="text-4xl text-brand-bud">200+</AccentText>
  <Caption className="mt-1">Members</Caption>
</div>
```

## Color Palette

### Core Palette
- **Linen** `#FAF6E2` - Primary background
- **Obsidian** `#161716` - Primary text
- **Burnt Orange** `#EC6839` - Activism, urgency
- **Bud Green** `#B5D340` - Growth, freshness
- **Amber Brown** `#C06F2D` - Resilience

### Topic Colors
- **Forest Green** `#137B48` - Nature
- **Cloud Burst** `#172F56` - Policy/Ocean
- **Wild Raspberry** `#E25072` - Gender
- **Electric Orchid** `#D15ECB` - Arts/Culture
- **Morning Ray** `#F1F98A` - Indigenous
- **Glacier Mist** `#CBEAF1` - Air/Weather

### Utility
- **Earth** `#6B6B6B` - Secondary text
- **Gray** `#E5E5E5` - Borders

---

**Version:** 1.0.0  
**Last Updated:** February 2, 2026  
**Design System:** COMMONS YOUTH Brand Identity Guidelines (2026)
