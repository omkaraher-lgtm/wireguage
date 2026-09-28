# wireguage

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-68nkqooh)

## PWA & Android APK

The app is an installable, offline-capable PWA (`vite-plugin-pwa`).

```bash
npm install
npm run build
npm run preview        # test at http://localhost:4173 (install prompt + offline)
```

### Build an Android APK with PWABuilder
1. Deploy `dist/` to any **HTTPS** host (Netlify, Vercel, Cloudflare Pages, GitHub Pages at the domain root).
2. Go to https://www.pwabuilder.com, enter your deployed URL, and click **Start**.
3. Under **Package for Stores → Android**, click **Generate Package**, set your package ID (e.g. `com.yourname.wiregauge`), and download.
4. The zip contains a signed `.apk` (for sideloading/testing) and an `.aab` (for Play Store) plus your signing key — **keep the key safe**.

Notes:
- The manifest uses absolute paths (`/`), so host at the domain root (not a sub-path). For a sub-path, change `start_url`, `scope`, `id` and icon paths in `vite.config.ts`.
- Icons live in `public/icons/` and can be regenerated with `python3 scripts/generate-icons.py` (Pillow), or replace them with your own artwork (keep the maskable ones with ~20% padding).
- Optional: add `screenshots` to the manifest for a richer install UI.
