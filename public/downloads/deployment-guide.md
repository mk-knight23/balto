# Website deployment

GitHub: https://github.com/mk-knight23/balto

The upgrade uses React, TypeScript and Vite. Run `npm install`, `npm run dev`, `npm test` and `npm run build`. The static `dist` build deploys through `.github/workflows/pages.yml` on main. Relative asset base is `./`; both `index.html` and `library.html` are emitted. Configure GitHub Pages to use GitHub Actions. Deployment needs repository authorization and a successful workflow; verify both public destinations and file downloads before claiming a live release.

Checks: white/gold palette, mobile layout, event count classifier, no secrets, no private hiring invite URL, no user data sent from the browser.
