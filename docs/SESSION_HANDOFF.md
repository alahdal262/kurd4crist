# SESSION_HANDOFF — kurd4crist

## 2026-11-06 — Publish kurdsforchrist.org (in progress)
- Plan chosen by the owner: GitHub Pages hosting, new repo `alahdal262/kurd4crist`, DNS through Cloudflare.
- Cloudflare zone `kurdsforchrist.org` is active (Free plan). It has no DNS records yet. SSL mode is "full".
  The token in `.claude/CloudFlare` has zone-level rights only (DNS, settings), with no account access, so it can't be used for Cloudflare Pages.
- Done: `.claude/CloudFlare` and `.claude/GitHub` are git-ignored. Added `public/CNAME` (kurdsforchrist.org) and `public/.nojekyll`.
- Next: create the repo, push `main`, publish `public/` to a `gh-pages` branch, enable Pages with the custom domain,
  then add Cloudflare DNS: apex A records for the GitHub IPs plus a `www` CNAME to alahdal262.github.io.
- Note: the site is still marked as a pre-launch prototype (robots.txt Disallow plus noindex meta). This was left unchanged.
- Share preview: every page now has og:image and twitter:card tags pointing to https://kurdsforchrist.org/assets/og-image.jpg (1536x1024).
  Share image now `public/assets/og-image.png` (1200x630), made from the owner logo on ivory. Site header and footer use `assets/logo-emblem.png`; the full logo is at `assets/logo.png`. robots.txt now lets link-preview bots in (Facebook, WhatsApp, X, LinkedIn, Telegram, Slack, Discord) but still blocks search engines.
- Done: local commit 716ca0f on `main`. The `gh-pages` branch is a subtree split of `public/`. Remote `origin` is https://github.com/alahdal262/kurd4crist.git (the repo exists and is empty).
- Done: Cloudflare DNS for GitHub Pages: 4 A records, 4 AAAA records, and `www` CNAME to alahdal262.github.io. All are DNS-only (grey cloud) so GitHub can issue the certificate.
- Blocked: no GitHub credentials, so nothing is pushed yet. The hermes-broker SSH key wasn't used. Next: `git push -u origin main gh-pages`,
  then GitHub Settings > Pages: branch `gh-pages` /(root), custom domain kurdsforchrist.org, Enforce HTTPS.
  Optional later: turn on the Cloudflare proxy (orange cloud) once the GitHub cert is issued. SSL mode is already "full".
- 2026-11-06 LIVE: https://kurdsforchrist.org is served by GitHub Pages from `gh-pages`. The certificate is approved and HTTPS is enforced. www redirects to the apex.
  Token is in `.claude/Github` (git-ignored). To republish after changing public/: `git branch -f gh-pages $(git subtree split --prefix public HEAD)` and push gh-pages.
  The Cloudflare proxy is left off (DNS-only) so GitHub can renew its certificate.

## 2026-11-06 — Site translated: Kurmanji, Sorani, Arabic
- app.js: the language buttons now really translate. A DOM text and attribute swap uses dictionaries in `public/i18n/{kmr,ckb,ar}.js`; the key is the English text, normalised for whitespace.
  Sorani and Arabic set `dir=rtl` and the matching `lang`. The choice is remembered in localStorage. Links can force a language with `?lang=ku|so|ar`.
  Dynamic text (donation summary, dialogs, filter toasts) goes through `t()`.
- styles.css: Arabic-script fonts (Noto Naskh) for headings and body, and no letter-spacing for ar/ckb.
- 1,001 strings per language, machine-assisted. NEEDS NATIVE-SPEAKER REVIEW before public launch, especially Bible verses, legal terms (CIO, Gift Aid) and trustee name spellings.
- If English text in the HTML changes, that string shows in English until its translation is added to the i18n files.
