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
