# COMMONS YOUTH Color Usage Guidelines

This document outlines proper color usage patterns for the COMMONS YOUTH platform, following the **60-30-10 Rule** from the Brand Identity Guidelines (2026).

## The 60-30-10 Rule

### 60% Base Colors (Linen & Obsidian)
**Usage:** Backgrounds, text, primary UI elements

**Colors:**
- **Linen** `#FAF6E2` - `bg-brand-linen`
  - Main page backgrounds
  - Card backgrounds
  - Section backgrounds
  - Input field backgrounds

- **Obsidian** `#161716` - `bg-brand-obsidian`, `text-brand-obsidian`
  - Primary text color
  - Dark sections (stats bar, footer)
  - Button backgrounds (primary variant)
  - Borders and outlines

**Examples:**
```tsx
<div className="bg-brand-linen">  {/* Main background */}
  <h1 className="text-brand-obsidian">Title</h1>  {/* Primary text */}
  <Card className="bg-white">  {/* Card on linen */}
    <p className="text-brand-obsidian">Content</p>
  </Card>
</div>
```

### 30% Brand Colors (Primary Palette)
**Usage:** Primary actions, highlights, brand elements

**Colors:**
- **Bud Green** `#B5D340` - `bg-brand-bud`, `text-brand-bud`
  - Success states
  - Active states
  - Primary badges
  - Hover states on buttons
  
- **Burnt Orange** `#EC6839` - `bg-brand-orange`, `text-brand-orange`
  - Call-to-action accents
  - Error states
  - Warning badges
  - Important highlights
  
- **Amber Brown** `#C06F2D` - `bg-brand-amber`, `text-brand-amber`
  - Secondary actions
  - Warm accents
  - Alternative highlights

**Examples:**
```tsx
<Button variant="primary">  {/* Obsidian bg */}
  <MapPin className="text-brand-linen" />
</Button>

<Button variant="secondary" className="hover:bg-brand-bud">
  {/* Hover uses brand color */}
</Button>

<Badge variant="primary">  {/* Uses Bud Green */}
  Featured
</Badge>

<Badge variant="danger">  {/* Uses Orange */}
  Urgent
</Badge>
```

### 10% Accent Colors (Topic Colors)
**Usage:** Sparingly for specific topics, categories, subtle accents

**Colors:**
- **Forest Green** `#137B48` - Nature/Environment topics
- **Cloud Burst** `#172F56` - Policy/Governance topics
- **Wild Raspberry** `#E25072` - Gender/Health topics
- **Electric Orchid** `#D15ECB` - Arts/Culture topics
- **Morning Ray** `#F1F98A` - Indigenous/Light accents
- **Glacier Mist** `#CBEAF1` - Air/Weather topics

**Examples:**
```tsx
{/* Category-specific badges */}
<Badge className="bg-brand-forest text-white">Nature</Badge>
<Badge className="bg-brand-ocean text-white">Policy</Badge>

{/* Subtle background accents (5-10% opacity) */}
<div className="bg-brand-ocean/10 p-4">
  <Badge className="bg-brand-ocean/20 text-brand-ocean">
    #Policy
  </Badge>
</div>

{/* Icon accents */}
<div className="bg-brand-raspberry/20 rounded-full p-3">
  <Heart className="text-brand-raspberry" />
</div>
```

## Utility Colors

### Earth (Secondary Text)
`#6B6B6B` - `text-brand-earth`

**Usage:**
- Secondary text
- Descriptions
- Helper text
- Captions
- Metadata

```tsx
<h2 className="text-brand-obsidian">Title</h2>
<p className="text-brand-earth">Description text</p>
<Caption className="text-brand-earth">Additional info</Caption>
```

### Gray (Borders & Dividers)
`#E5E5E5` - `border-brand-gray`, `bg-brand-gray`

**Usage:**
- Input borders
- Card dividers
- Subtle backgrounds
- Inactive states

```tsx
<Input className="border-brand-gray" />
<div className="border-t border-brand-gray" />
<div className="bg-brand-gray/50">Disabled</div>
```

## Common Patterns

### Hero Sections
```tsx
<section className="bg-brand-linen">  {/* 60% - Base */}
  <Badge variant="warning">New</Badge>  {/* 10% - Accent */}
  <Heading className="text-brand-obsidian">  {/* 60% - Base text */}
    Main Title
  </Heading>
  <Button variant="primary">  {/* 30% - Brand (via Obsidian) */}
    Get Started
  </Button>
</section>
```

### Stats Display
```tsx
<div className="bg-brand-obsidian text-brand-linen">  {/* 60% - Base */}
  <AccentText className="text-brand-bud">200+</AccentText>  {/* 30% - Brand */}
  <Caption className="text-brand-linen/80">Members</Caption>
</div>
```

### Cards & Content
```tsx
<Card className="bg-white">  {/* 60% - Base */}
  <Subheading className="text-brand-obsidian">  {/* 60% - Base text */}
    Feature Name
  </Subheading>
  <Badge variant="success">Active</Badge>  {/* 30% - Brand */}
  <BodyText className="text-brand-earth">  {/* Utility */}
    Description text
  </BodyText>
</Card>
```

### Forms
```tsx
<Input 
  className="border-brand-gray bg-white focus:border-brand-bud"
  {/* 60% white, utility gray, 30% brand on focus */}
/>
<Button variant="primary">  {/* 30% via Obsidian (monochrome) */}
  Submit
</Button>
```

### Category Tags
```tsx
{/* Use topic colors (10%) sparingly */}
<Badge className="bg-brand-forest/20 text-brand-forest">
  #Environment
</Badge>
<Badge className="bg-brand-ocean/20 text-brand-ocean">
  #Policy
</Badge>
```

## Anti-Patterns (Avoid)

❌ **Too many bright colors competing:**
```tsx
<div className="bg-brand-orange">
  <div className="bg-brand-bud">
    <div className="bg-brand-raspberry">  {/* Overwhelming! */}
```

❌ **Accent colors as backgrounds:**
```tsx
<div className="bg-brand-orchid">  {/* Reserve for 10% usage */}
```

❌ **Not enough base colors:**
```tsx
<div className="bg-gradient-to-r from-brand-orange to-brand-bud">
  {/* Needs more Linen/Obsidian base */}
```

✅ **Correct balance:**
```tsx
<div className="bg-brand-linen">  {/* 60% base */}
  <Card className="bg-white border-brand-obsidian">  {/* 60% base */}
    <Badge variant="primary">New</Badge>  {/* 30% brand */}
    <span className="bg-brand-forest/10">  {/* 10% accent */}
      #Environment
    </span>
  </Card>
</div>
```

## Opacity Guidelines

When using accent colors, reduce opacity to maintain the 60-30-10 balance:

- **Background accents:** 3-10% opacity
  ```tsx
  className="bg-brand-ocean/5"  {/* Very subtle */}
  className="bg-brand-bud/10"   {/* Subtle hint */}
  ```

- **Badge backgrounds:** 10-20% opacity with solid text
  ```tsx
  className="bg-brand-forest/20 text-brand-forest"
  ```

- **Hover states:** 10-30% opacity
  ```tsx
  className="hover:bg-brand-bud/20"
  ```

## Accessibility

### Contrast Requirements
- Text on Linen: Use Obsidian (primary text)
- Text on Obsidian: Use Linen or white
- Text on Brand colors: Check contrast ratio ≥ 4.5:1

### Good Contrast Pairs
✅ `text-brand-obsidian` on `bg-brand-linen`
✅ `text-white` on `bg-brand-obsidian`
✅ `text-white` on `bg-brand-ocean`
✅ `text-brand-obsidian` on `bg-brand-bud`

### Poor Contrast (Avoid)
❌ `text-brand-earth` on `bg-brand-gray`
❌ `text-brand-morning` on `bg-brand-linen`

## Quick Reference

| Usage | % | Colors | Class Examples |
|-------|---|--------|----------------|
| **Backgrounds & Text** | 60% | Linen, Obsidian | `bg-brand-linen`, `text-brand-obsidian` |
| **Brand Elements** | 30% | Bud, Orange, Amber | `bg-brand-bud`, `text-brand-orange` |
| **Accents & Topics** | 10% | Forest, Ocean, etc. | `bg-brand-forest/10`, `text-brand-ocean` |
| **Utility** | As needed | Earth, Gray | `text-brand-earth`, `border-brand-gray` |

---

**Remember:** The 60-30-10 rule creates visual hierarchy and prevents color chaos. When in doubt, use more base colors (Linen/Obsidian) and less accent colors.

**Last Updated:** February 2, 2026
