# TigerDuck Web

Marketing landing page for **TigerDuck** — a campus assistant app for NTUST students. Deployed at [tigerduck.app](https://tigerduck.app).

Built with **Vite + React + TypeScript**, served from **Cloudflare Workers** static assets.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build & preview

```bash
npm run build        # outputs to dist/
npm run preview      # local Vite preview of the build
npm run cf:preview   # build + Wrangler preview (Workers runtime)
```

## Deploy

```bash
npm run deploy       # builds and pushes to Cloudflare Workers
```

The first deploy needs `wrangler login`. The custom domain `tigerduck.app` must already be added to your Cloudflare account as a Zone — `wrangler.jsonc` binds the route automatically.

## Project layout

```
src/
├── App.tsx                    # page composition
├── main.tsx                   # entry, mounts <App />
├── styles/
│   ├── tokens.css             # design tokens (colors, spacing, typography)
│   └── site.css               # component styles (.td-* classes)
├── components/
│   ├── TopNav.tsx
│   ├── Footer.tsx
│   ├── PlatformCTA.tsx        # iOS/Android/Desktop-aware download buttons
│   ├── hero/
│   │   ├── HeroB.tsx
│   │   └── HeroPhonePlaceholder.tsx
│   ├── sections/              # Why, Features, Tech, Roadmap, CTA
│   └── phone/                 # Phone-frame mock screens for Features carousel
├── hooks/useReveal.ts         # IntersectionObserver-based reveal
└── lib/
    ├── constants.ts           # store URLs, repo URLs
    └── detectPlatform.ts      # iOS / Android / Desktop UA sniffing
```

Path alias: `@/*` → `src/*`.

## Cloudflare Workers config

`wrangler.jsonc` uses **Workers Static Assets**:

- `assets.directory: "./dist"` — Vite build output
- `assets.not_found_handling: "single-page-application"` — SPA fallback to `/index.html`
- `routes` — custom domain `tigerduck.app/*` and `www.tigerduck.app/*`

No worker code is required — assets are served directly from Cloudflare's edge.

## Design source

The visual spec lives in the design bundle from claude.ai/design. Tokens are mirrored verbatim from `styles/tokens.css` of the source bundle; component class names use the `td-*` prefix established there.

## License

The TigerDuck app itself is AGPL-3.0. This marketing site has not yet been assigned a license.
