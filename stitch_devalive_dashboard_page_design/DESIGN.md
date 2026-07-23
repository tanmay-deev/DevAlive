---
name: DevAlive Core
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353438'
  on-surface: '#e4e1e6'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1e6'
  inverse-on-surface: '#303033'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#ff5451'
  on-tertiary-container: '#5c0008'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#131316'
  on-background: '#e4e1e6'
  surface-variant: '#353438'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for developers who value precision, speed, and clarity. It balances a high-density information display with an elegant, "dark-mode first" aesthetic that reduces eye strain during long monitoring sessions. 

The visual style is a blend of **Minimalism** and **Technical Modernism**. It draws inspiration from the utility of code editors and the refined craftsmanship of high-end developer tools. Expect heavy use of whitespace to separate critical metrics, high-contrast typography for readability, and subtle atmospheric depth to create a layered, organized workspace. The emotional response should be one of absolute control, reliability, and technical sophistication.

## Colors

The palette is rooted in a deep charcoal foundation to establish a premium, "night-owl" environment. 

- **Background & Surface:** The primary canvas is almost black (#0A0A0A), while UI surfaces and cards use a slightly lighter elevation (#18181B) to create structural hierarchy without traditional shadows.
- **Accents:** Indigo is the primary driver for action and focus. Semantic colors (Green, Red, Amber) are reserved strictly for system status—Uptime, Downtime, and Latency Warnings—ensuring they provide immediate visual signals against the neutral backdrop.
- **Borders:** Thin, subtle borders (#27272A) replace heavy shadows to define the "container-first" architecture typical of modern SaaS platforms.

## Typography

Typography in this design system prioritizes legibility and technical expression. 

1. **Headlines (Geist):** Used for large displays and page titles. Its geometric, slightly condensed nature feels engineered and modern.
2. **Body (Inter):** The workhorse for all descriptive text. It provides exceptional readability at small sizes and high pixel density.
3. **Labels & Data (JetBrains Mono):** All system metrics, IDs, timestamps, and status labels must use a monospaced font. This ensures that changing numbers don't cause layout shift and reinforces the developer-centric aesthetic.

Use **Display LG** sparingly for dashboard overviews. For mobile, scale headlines down by one tier (e.g., Headline LG becomes 24px) to maintain balance.

## Layout & Spacing

This design system utilizes an **8pt Spacing System** to ensure mathematical harmony across all layouts.

- **Grid Model:** A 12-column fluid grid is used for desktop (breakpoints at 1280px and 1440px). On mobile, the layout reflows to a single column with 16px horizontal margins.
- **Container Strategy:** Content is housed in "Surface" cards. Large dashboard views should use a "Fixed Grid" approach on ultra-wide monitors to prevent line lengths from becoming unreadable, while using "Fluid" scaling on smaller laptops.
- **Rhythm:** Use `md` (16px) for internal card padding and `lg` (24px) for spacing between major sections or cards.

## Elevation & Depth

To maintain a minimal and technical feel, depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Base):** #0A0A0A. The background layer.
- **Level 1 (Cards/Surfaces):** #18181B. Used for the primary content containers. 
- **Level 2 (Popovers/Modals):** #27272A. Used for elements that sit on top of cards. These elements should include a very subtle, diffused 10% black shadow to provide separation from the Level 1 surface.
- **Borders:** All cards and interactive elements must have a 1px solid border (#27272A). For "active" states (e.g., a selected card or focused input), the border color should transition to the Primary Accent (#6366F1).

## Shapes

The shape language is sophisticated yet friendly. While the overall system is technical, the use of **Rounded** corners prevents the UI from feeling cold or unapproachable.

- **Primary Radius:** 0.5rem (8px) for standard buttons and input fields.
- **Secondary Radius (LG):** 1rem (16px) for all main content cards and dashboard modules.
- **Tertiary Radius (XL):** 1.5rem (24px) for large promotional banners or modals.

Status indicators and "pills" should always use a full height-based radius (pill-shaped) to distinguish them from interactive buttons.

## Components

- **Buttons:** Primary buttons are solid Indigo (#6366F1) with white text. Secondary buttons are outlined (#27272A) with a subtle hover transition to a lighter gray.
- **Cards:** 16px corner radius, #18181B background, 1px #27272A border. Cards should not have shadows unless they are hoverable/interactive, in which case a subtle glow effect from the Indigo accent can be used.
- **Inputs:** Dark background (#0A0A0A), 1px border. On focus, the border becomes Indigo with a 2px outer "ring" of Indigo at 20% opacity. Labels should use `label-sm` (JetBrains Mono).
- **Chips/Status:** Use pill shapes with a 10% opacity background of the semantic color (e.g., Status: Up uses Green background at 10% with solid Green text).
- **Uptime Graphs:** Use a series of vertical bars (sparks). Color coding should follow the semantic palette. Height should be consistent to maintain the grid's rhythm.
- **Lists:** Clean rows separated by 1px borders. Use `label-md` for technical data points like IP addresses or Latency (ms).