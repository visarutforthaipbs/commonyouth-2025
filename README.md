<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# COMMONS YOUTH Platform

A platform for Thai youth to unite, exchange knowledge, and co-create solutions to social issues through technology and social innovation.

## 🎨 Design System

This project follows the **COMMONS YOUTH Brand Identity Guidelines (2026)**.

- **[Design System Showcase](/#/design-system)** - View all components and patterns
- **[Component Library](components/ui/README.md)** - Reusable UI components
- **[Color Usage Guide](COLOR-USAGE.md)** - Color patterns and the 60-30-10 rule
- **[Design System Document](design-system.md)** - Complete brand guidelines

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
4. Visit the design system showcase:
   `http://localhost:5173/#/design-system`

## 🧩 Component Library

We've built a comprehensive design system with reusable components:

- **Button** - Monochrome buttons following design guidelines
- **Badge** - Flexible badges with PT Mono support
- **Card** - Multiple card variants including BrowserCard
- **Typography** - Heading, Subheading, BodyText, Caption, AccentText
- **Forms** - Input, Textarea, Select, Checkbox

### Example Usage

```tsx
import { Button, Badge, Card, Heading } from './components/ui';

<Card variant="elevated">
  <Badge variant="primary" mono>NEW</Badge>
  <Heading className="text-4xl">Welcome</Heading>
  <Button variant="primary" icon={MapPin}>
    Explore
  </Button>
</Card>
```

## 📐 Design Principles

### 60-30-10 Color Rule
- **60%** Base colors (Linen & Obsidian)
- **30%** Brand colors (Bud Green, Burnt Orange)
- **10%** Accent colors (Topic-specific)

### Typography Hierarchy
- **Main Heading**: Anuphan Bold, ALL CAPS
- **Subheader**: Anuphan Semibold, 65% of heading
- **Body**: Anuphan Regular, 42% of heading
- **Caption**: Anuphan Light
- **Accent**: PT Mono for numeric data

## 🚀 Features

- Interactive Thailand map with youth group locations
- Group directory and discovery
- Activity calendar and event management
- Project showcase and case studies
- User dashboard for group management
- Responsive design system
