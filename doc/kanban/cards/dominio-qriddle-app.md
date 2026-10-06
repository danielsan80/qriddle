# Spostare l'app su qriddle.app

Il dominio `qriddle.app` è registrato su Cloudflare (ottobre 2026, scadenza ottobre 2027).

Già fatto:

- quattro record `A` verso GitHub Pages (`185.199.108.153`–`185.199.111.153`), con il
  proxy di Cloudflare spento: col proxy GitHub non riesce a emettere il certificato, e
  `.app` funziona solo in HTTPS;
- il dominio è verificato sull'account GitHub (record `TXT`
  `_github-pages-challenge-danielsan80`), così nessun altro può agganciarlo a un suo repo.

Da fare, tutto nello stesso giro: se il dominio si imposta prima del codice, l'app cerca i
suoi file sotto `/qriddle/` e si rompe.

- `base` in `vite.config.ts` da `/qriddle/` a `/`;
- l'URL del sito in `index.html` (canonical, Open Graph, JSON-LD), `src/lib/config/config.ts`
  (`siteUrl`), `public/robots.txt`, `public/sitemap.xml`, `README.md`;
- l'esempio "path" in `src/lib/util/examples.ts`: lo stato compresso contiene
  `https://danilosanchi.net/qriddle` come testo del QR;
- `qriddle.app` come dominio personalizzato nelle impostazioni Pages del repo, con "Enforce
  HTTPS" appena il certificato è pronto.

Da verificare dopo:

- che `danilosanchi.net/qriddle/` reindirizzi a `qriddle.app`, e che il frammento `#…`
  con il lavoro salvato sopravviva al redirect: i link già condivisi devono continuare a
  funzionare;
- l'anteprima del link (Open Graph) col dominio nuovo.
