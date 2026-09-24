---
name: Cognitive Intelligence System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#23005c'
  on-tertiary-container: '#9466ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 32px
  gutter: 24px
  sidebar-width: 280px
  card-padding: 24px
---

## Brand & Style

The design system is engineered for a premium AI Sales Agent platform, balancing the high-trust requirements of enterprise SaaS with the cutting-edge aesthetic of modern artificial intelligence. The visual narrative centers on **"Precision Intelligence"**—a style that combines a professional, data-driven core with ethereal, fluid AI accents.

The system utilizes a **Modern Corporate** foundation characterized by expansive white space and a structured Dark Navy sidebar, punctuated by **Glassmorphism** and vibrant gradients to denote AI-driven insights. The goal is to evoke a sense of calm, hyper-efficient control over complex sales data.

## Colors

The palette is anchored by **Deep Navy (#0F172A)**, used for primary navigation and high-level structural elements to establish authority. **Electric Blue (#3B82F6)** serves as the functional action color for buttons, links, and active states.

**AI Elements:** A specific gradient transitioning from Indigo to Cyan is reserved exclusively for AI-generated content, suggestions, and "agent" status indicators. 

**Surfaces:** Backgrounds utilize **Subtle Gray (#F8FAFC)** to reduce eye strain, while cards and containers use **Surface White (#FFFFFF)** with varying levels of transparency to achieve the glassmorphic effect.

## Typography

This design system utilizes **Inter** for its exceptional legibility in data-dense environments. The type scale is optimized for a dashboard hierarchy, using tight letter spacing on larger headings to maintain a modern, "tech-forward" feel.

- **Weight Usage:** Bold (700) is reserved for Display levels. Semi-bold (600) is the standard for section headers and titles. Medium (500) is used for interactive labels and button text to ensure prominence against vibrant backgrounds.
- **Data Display:** For tabular data and numerical values, ensure `font-feature-settings: "tnum" on, "lnum" on` is applied to maintain vertical alignment in columns.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The **Sidebar** is fixed at 280px, while the main content area utilizes a fluid grid that adapts to the viewport.

- **Grid:** A 12-column grid is used for the main stage. 
- **Rhythm:** An 8px linear scale (referenced as units of 4px) governs all spatial relationships. 
- **Responsive Behavior:** On Tablet, the sidebar collapses into a rail (80px). On Mobile, the sidebar moves to a bottom navigation bar or a hidden drawer, and margins reduce from 32px to 16px.

## Elevation & Depth

The design system achieves depth through **Glassmorphism** rather than traditional heavy shadows.

1.  **Level 0 (Base):** Subtle Gray (#F8FAFC) background.
2.  **Level 1 (Cards):** Surface White (#FFFFFF) with a 1px border at 8% opacity of Deep Navy. 
3.  **Level 2 (AI Overlays):** Semi-transparent white (80% opacity) with a `backdrop-filter: blur(12px)`. These elements should have a subtle inner glow (1px white stroke at 20% opacity).
4.  **Level 3 (Modals/Popovers):** Focused depth using a diffused "Ambient Shadow": `0px 20px 40px rgba(15, 23, 42, 0.1)`.

## Shapes

The shape language is approachable yet disciplined. The standard radius for primary containers and cards is **12px to 16px**.

- **Buttons & Inputs:** Use the `rounded-lg` (16px) setting to provide a soft, modern feel that contrasts with the sharp data points.
- **Status Badges:** Use `rounded-xl` (24px/Pill) to distinguish them clearly from interactive buttons.
- **Sidebar Items:** Use `rounded-md` (8px) for internal list items to maintain a tighter density within the fixed column.

## Components

### Glassmorphism Cards
Cards are the primary container. They feature a 1px `border-subtle`, a white background, and a soft 4px blur if positioned over colored backgrounds. AI-insight cards may feature a top-border using the **AI Gradient**.

### Sleek Navigation
The sidebar uses **Deep Navy** as its base. Active states should be indicated by a vertical pill-shaped indicator in **Electric Blue** on the left edge and a subtle background highlight (10% white opacity).

### Data Tables
Tables are clean with no vertical borders. Headers use `label-md` in a muted gray. Rows feature a hover state that lightens the background to `#F1F5F9`. The "AI Confidence" column should utilize small sparklines or the AI Gradient.

### Status Badges
Badges use a "soft-fill" approach: a highly desaturated version of the status color for the background and the full-saturated color for the text (e.g., Success = Light Green BG / Dark Green Text).

### Input Fields
Inputs use a 1px border that shifts to **Electric Blue** on focus. The background is `#FFFFFF`. Placeholder text is in a light neutral gray to maintain a clean look.