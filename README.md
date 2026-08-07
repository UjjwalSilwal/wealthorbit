This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Project Structure

```txt
D:\Freelance\wealthorbit\src
├───app
│   ├───(auth)
│   │   └───login
│   │       └───page.tsx
│   ├───(dashboard)
│   │   ├───dashboard
│   │   │   └───page.tsx
│   │   ├───markets
│   │   │   └───page.tsx
│   │   ├───screener
│   │   │   └───page.tsx
│   │   ├───charts
│   │   │   └───page.tsx
│   │   ├───news
│   │   │   └───page.tsx
│   │   ├───about
│   │   │   └───page.tsx
│   │   ├───settings
│   │   │   └───page.tsx
│   │   └───layout.tsx
│   ├───layout.tsx
│   └───page.tsx
├───components
│   ├───ui
│   │   ├───Button.tsx
│   │   ├───Card.tsx
│   │   ├───Badge.tsx
│   │   ├───Input.tsx
│   │   ├───Avatar.tsx
│   │   └───index.ts
│   ├───layout
│   │   ├───Header.tsx
│   │   ├───Footer.tsx
│   │   ├───Sidebar.tsx
│   │   └───MobileNav.tsx
│   ├───market
│   │   ├───MarketTicker.tsx
│   │   ├───MarketOverview.tsx
│   │   ├───StockChart.tsx
│   │   ├───NewsFeed.tsx
│   │   ├───Watchlist.tsx
│   │   └───MarketScreener.tsx
│   ├───animations
│   │   ├───AnimatedSection.tsx
│   │   ├───AnimatedCard.tsx
│   │   ├───ParticleBackground.tsx
│   │   └───ScrollReveal.tsx
│   └───sections
│       ├───HeroSection.tsx
│       ├───FeaturesSection.tsx
│       └───CTASection.tsx
├───screens
│   ├───HomeScreen.tsx
│   ├───DashboardScreen.tsx
│   ├───MarketsScreen.tsx
│   ├───ScreenerScreen.tsx
│   ├───ChartsScreen.tsx
│   ├───NewsScreen.tsx
│   └───SettingsScreen.tsx
├───hooks
│   ├───useTheme.ts
│   ├───useMarketData.ts
│   ├───useAnimation.ts
│   └───useScroll.ts
├───lib
│   ├───api.ts
│   ├───marketData.ts
│   └───utils.ts
├───types
│   └───index.ts
├───styles
│   └───globals.css
└───assets
    └───images
        └───logo.svg
```

# themes guide
Key Inspiration `&` Design Gallery SitesAwwwards: The industry standard for award-winning, creative, and experimental web design. Great for modern layouts and interactive micro-animations.Godly: A curated gallery showcasing clean, modern, and high-converting web designs with video previews of interactions.Lapa Ninja: Specialized in modern SaaS, landing pages, and startup UI templates.Minimal Gallery: Hand-picked minimalist websites focusing on typography, clean spacing, and modern grid structures.  Siteinspire: Filterable showcase by category, style, and subject matter (e.g., modern, brutalist, corporate).Dribbble `&` Behance: Portfolios by professional UI/UX designers featuring full web layouts, mobile interfaces, and color palettes.

# For animations
1. Pre-Built Animated Component Kits (Copy & Paste)These offer ready-to-use, highly animated Tailwind + Motion components that you can paste directly into Next.js:  Aceternity UI: Modern UI components with glowing borders, 3D card tilt, parallax scroll effects, and animated backgrounds.  Magic UI: A collection of interactive landing page components (animated text, particle fields, borders, bento grids) designed specifically for Next.js + Tailwind + Motion.React Bits: Lightweight, animated React primitives, background effects, and interactive text effects.Hover.dev: Tailwind-specific animated components focusing on button hover states, card reveals, and navigation menus.2. Core Animation Libraries (For Custom Motion)If you want the AI to write custom interactive animations from scratch, tell it to use these frameworks:Motion (formerly Framer Motion): The standard for React/Next.js UI animations. Ideal for page transitions, element entrance/exit (AnimatePresence), hover/tap gestures, and layout morphing.GSAP + ScrollTrigger: The industry standard for complex, scroll-driven web animations and multi-stage timeline sequences.  Lenis: A lightweight smooth-scroll library that makes scroll-driven animations feel fluid.  3. Visual Inspiration `& `SnippetsCodePen Animation Showcase: Search for "Tailwind CSS Animations" or "Framer Motion" to preview hover effects, text reveals, and button spinners.  Awwwards GSAP Gallery: Award-winning production sites showcasing advanced web motion.