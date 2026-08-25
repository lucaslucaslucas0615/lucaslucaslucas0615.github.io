---
name: Shadow Sovereign
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393842'
  surface-container-lowest: '#0d0d16'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#302f39'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is a high-octane, tech-forward aesthetic inspired by "The System" interface from Solo Leveling. It targets a gaming and anime-enthusiast audience, aiming to evoke feelings of progression, power, and digital mysticism. 

The visual style blends **Modern Corporate** precision with **Glassmorphism** and **Vaporwave** energy. It utilizes deep, immersive dark backgrounds to make vibrant, glowing accents pop, simulating a futuristic "HUD" (Heads-Up Display). High-contrast typography and interactive "energy" states are central to the experience, creating a UI that feels alive and responsive to the user's "leveling" journey.

## Colors

The palette is rooted in deep space:
- **Primary & Secondary:** Electric Blue and Intense Purple form the "Mana" core. They should be used for primary actions, progress bars, and high-level status indicators.
- **Backgrounds:** Use `#0a0a12` for the main canvas and `#12121a` for elevated surfaces like cards and navigation bars.
- **Gradients:** Use the `accent_gradient` for call-to-action buttons and critical "Level Up" notifications.
- **Functional Colors:** Use Cyan (#06b6d4) for secondary informational highlights and success states.

## Typography

Typography focuses on readability paired with aggressive hierarchy. 
- **Headlines:** Montserrat is used for all headings to provide a bold, geometric, and "boss-level" presence. Use Heavy (900) or Bold (700) weights for section titles.
- **Body:** Inter provides a clean, systematic feel for long-form content, statistics, and lore descriptions.
- **Labels:** Use uppercase Inter with increased letter spacing for technical metadata, such as "RANK", "CLASS", or "LEVEL".

## Layout & Spacing

This design system uses a **Fluid Grid** model with generous safe areas to maintain an "uncluttered HUD" feel.
- **Grid:** 12-column desktop grid with 24px gutters.
- **Desktop:** Content is centered within a 1280px container.
- **Mobile:** Elements reflow to a single column with 16px side margins. 
- **Rhythm:** All spacing (padding, margins) should be multiples of the 8px base unit to ensure systematic alignment.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Tonal Layering**:
- **Base Level:** `#0a0a12` (Flat).
- **Surface Level:** `#12121a` with a 1px border (`rgba(255,255,255,0.1)`).
- **Interactive Level:** On hover, surfaces should apply a subtle backdrop-blur (12px) and a primary-colored outer glow (0px 0px 20px rgba(59, 130, 246, 0.3)).
- **Overlays:** Modals and tooltips use 20% opacity white overlays with heavy backdrop-blur (20px) to create the "System Window" effect.

## Shapes

The design system utilizes **Pill-shaped** and highly rounded geometry to contrast the dark, sharp nature of the content. 
- **Standard Radius:** 1rem (16px) for most interactive components.
- **Large Radius (2xl/3xl):** 2rem (32px) for main content cards and containers to create a soft, modern silhouette.
- **Interactive Elements:** Buttons and tags should always use the maximum roundedness (pill-shape) to emphasize their "System" interface origin.

## Components

- **Buttons:** Primary buttons use the `accent_gradient`. On hover, apply a `brightness(1.2)` filter and a 10px spread glow in the primary color.
- **Cards:** Background `#12121a`, 1px border of `white` at 10% opacity. On hover, the border color shifts to the primary electric blue.
- **Input Fields:** Darker than the surface (`#050508`), with a 1px border. Focus state triggers a purple-to-blue gradient border.
- **Chips/Badges:** Small, pill-shaped elements with low-opacity fills of the primary/secondary colors and high-contrast text.
- **Progress Bars:** Use the `accent_gradient` for the fill. Add a subtle "pulse" animation to indicate active "Leveling" or loading.
- **Status Indicators:** Glowing dots or "Rank" icons (e.g., S-Rank, E-Rank) should use stylized, high-contrast serif accents if available, or bold Montserrat.