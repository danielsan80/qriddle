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
- lo script Umami in `index.html`: `data-domains="danilosanchi.net"` non conterebbe le
  visite su `qriddle.app`; va controllato anche il dominio del sito nel pannello di Umami;
- `config.siteUrl` è stampato sul retro del biglietto, come testo e come QR: col dominio
  nuovo il QR viene un po' meno fitto;
- `qriddle.app` come dominio personalizzato nelle impostazioni Pages del repo, con "Enforce
  HTTPS" appena il certificato è pronto. Il deploy parte col push su `master`; col deploy
  via Actions il file `CNAME` nel repo non serve;
- record `CNAME` da `www` a `danielsan80.github.io` su Cloudflare, proxy spento, così
  `www.qriddle.app` porta al dominio principale.

Da verificare dopo:

- che `danilosanchi.net/qriddle/` reindirizzi a `qriddle.app`, e che il frammento `#…`
  con il lavoro salvato sopravviva al redirect: i link già condivisi devono continuare a
  funzionare;
- l'anteprima del link (Open Graph) col dominio nuovo, e il Post Inspector di LinkedIn per
  rinfrescare quella dei post già condivisi.

Dopo, con calma:

- Google Search Console: `qriddle.app` come proprietà, e la sitemap. Il "cambio di
  indirizzo" non serve: vale per un dominio intero, non per una sottocartella;
- il link sulla pagina Ko-fi, se cita l'indirizzo dell'app;
- sito, CV e LinkedIn: si aggiorna la fonte in danilosanchi.net, e il resto si ricava da lì.

Il redirect da `danilosanchi.net/qriddle` serve a una transizione morbida: biglietti
stampati col vecchio indirizzo non risultano.
