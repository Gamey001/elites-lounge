# Elites Lounge — Barbing Salon Landing Page

A fast, responsive, dependency-free landing page for **Elites Lounge**, a premium
barbing and grooming salon. Built with plain HTML, CSS and vanilla JavaScript —
no build step, no framework, no npm install.

## Preview

Open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## What's on the page

| Section | Purpose |
| --- | --- |
| Top bar + sticky nav | Opening status, phone, anchor navigation, mobile drawer |
| Hero | Headline, dual CTA, trust stats, animated barber-pole composition |
| Marquee | Scrolling strip of service keywords |
| Services | 8 services with naira pricing and durations, one featured card |
| Why Us | Four differentiators — hygiene, punctuality, lounge comfort, consultation |
| Barbers | Team cards with monogram avatars |
| Gallery | Masonry-style grid ready for real photos |
| Booking | Form that composes a pre-filled WhatsApp message |
| Visit | Address, opening hours, phone, email, socials |
| Footer + mobile FAB | Secondary nav and an always-visible Book button on phones |

## Tech notes

- **No dependencies.** One external request: Google Fonts (Bebas Neue + Outfit).
- **Responsive** at 1040px, 860px and 640px breakpoints.
- **Accessible**: semantic landmarks, labelled form fields, visible focus rings,
  `aria-expanded` on the nav toggle, and full `prefers-reduced-motion` support.
- **Scroll reveals** via `IntersectionObserver`, with a no-JS/no-support fallback
  that simply shows the content.
- **Booking** is serverless — the form builds a `wa.me` deep link, so there is no
  backend to host or secure.

## Make it yours

All placeholder content is marked with `TEMPLATE CONTENT` comments in `index.html`.

1. **WhatsApp number** — `script.js`, top of the file:
   ```js
   var WHATSAPP_NUMBER = "2348000000000"; // international format, digits only
   ```
2. **Phone & email** — search `+234 800 000 0000` and `hello@eliteslounge.example`
   in `index.html`.
3. **Address & hours** — the `.book__aside` block in `index.html`.
4. **Services & prices** — the `#services` section; each card is one `<article class="svc">`.
5. **Barbers** — the `#team` section. Replace the names, roles and the two-letter
   monograms, or swap `.member__photo` for an `<img>`.
6. **Gallery** — drop photos into `assets/` and replace each
   `<figure class="shot">` with `<img src="assets/your-photo.jpg" alt="…">`.
7. **Brand colours** — the `:root` block at the top of `styles.css`:
   ```css
   --obsidian: #0b0b0d;   /* background  */
   --gold:     #d9a84e;   /* accent      */
   --bone:     #f4f1ea;   /* body text   */
   ```

## Deploy

**GitHub Pages** — Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
The site is static, so it also drops straight onto Netlify, Vercel or Cloudflare Pages
with no configuration.

## Licence

MIT — see [LICENSE](LICENSE).
