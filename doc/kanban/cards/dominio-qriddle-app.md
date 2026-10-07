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

## Esito (7 ottobre 2026)

Online su `https://qriddle.app`. Il dominio su Pages è stato impostato via API subito dopo
il deploy, e il certificato è arrivato in un paio di minuti: l'app è rimasta irraggiungibile
solo per quel tempo.

Verificato:

- `danilosanchi.net/qriddle/` reindirizza a `https://qriddle.app/` con un 301, e un vecchio
  link col lavoro salvato nel frammento `#…` lo riapre;
- `http://` reindirizza a `https://`;
- file JavaScript e immagine di anteprima rispondono dal dominio nuovo;
- Umami registra: il sito in Umami è lo stesso, rinominato col dominio nuovo, e lo storico
  resta.

Il resto, attività manuali, sta in
[Strascichi del cambio di dominio](strascichi-cambio-dominio.md).

Il redirect da `danilosanchi.net/qriddle` serve a una transizione morbida: biglietti
stampati col vecchio indirizzo non risultano.
