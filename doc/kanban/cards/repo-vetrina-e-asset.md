# Ripulire il repo come vetrina (asset di terzi + presentazione)

Il repo è pubblico e serve anche da portfolio. La licenza CC BY-NC-SA 4.0
(`LICENSE`) e l'elenco degli asset di terzi (`NOTICE`) sono già a posto, ma
restano aperti questi punti.

## Asset di terzi ancora nel repo

Nessuno: la sezione è chiusa.

- ~~**`src/assets/fonts/EdwardianScriptITC.ttf`**~~ — sostituito da Corinthia
  (OFL), self-hostato. Anche DM Serif Display e Courier Prime non arrivano più
  da Google Fonts. Pinyon Script era il finalista alternativo, recuperabile da
  `3a0be78`.
- ~~**`src/assets/inner/images/bg.jpg`**~~ — la pergamena di Vecteezy è
  sostituita da una texture generata da `tools/generate-parchment.py`, che
  scrive il JPEG e riscrive il base64 dentro `inner.svg` e `outer.svg` così i
  tre non divergono. `bg_original.jpg` è cancellato.

Il `NOTICE` ora dichiara che tutte le immagini sono opera originale. Le icone
(`compass.png`, `palm.png`, `ship.png`, `vulcan.png`, `doc/data/map-icons.svg`)
lo erano già: verificato con l'autore, non serve rifarle.

## Presentazione

- ~~**`README.md` è ancora il boilerplate di Vite.**~~ — riscritto: cos'è, foto
  del biglietto, link al sito, come funziona l'algoritmo, come girarlo,
  licenza.
- ~~**`package.json` si chiama ancora `vite-temp`.**~~ — rinominato in
  `qriddle`.
- ~~**`doc/tmp/`** contiene materiale di scarto.~~ — sciolta. I quattro webp
  erano copie byte per byte di `src/assets/photos/`, cancellati. Il prototipo è
  diventato `doc/prototype/`, con un README che dice cos'è e cosa è cambiato
  dell'algoritmo. Carica ancora `qrcode.js` da CDN e i font da Google, ma è
  materiale d'archivio: non viene servito né buildato.

## Dove vivono `.claude/` e il kanban

`.claude/` e `doc/kanban/` sono committati e quindi pubblici. In particolare
`.claude/skills/monetization/SKILL.md` descrive la situazione fiscale personale
(P.IVA da consulente IT), i prezzi valutati e il ricorso al commercialista;
`.claude/CLAUDE.md` cita percorsi e progetti personali (`toshl-man`).

Il punto non è tanto la sensibilità di quel contenuto, quanto la **libertà di
scrittura**: l'idea di partenza era che istruzioni e board restassero nella
storia del progetto, ma sapere che sono pubbliche porta ad autocensurarsi, e
appunti autocensurati valgono poco. Le due cose sono incompatibili così come
stanno.

Opzioni sul tavolo:

1. **Separare pubblico e privato dentro lo stesso repo** — resta versionato e
   nella storia ciò che è davvero parte del progetto (istruzioni tecniche, skill
   di dominio, card delle feature), mentre le note libere finiscono in un'area
   ignorata da git (es. `doc/private/`, `.claude/local/`). Perde la storia solo
   sulla parte privata.
2. **`.claude/` in un repo privato separato**, agganciato in locale (symlink o
   submodule privato). Mantiene la storia di tutto, ma il repo pubblico non
   mostra più come è stato costruito il progetto — che per una vetrina è
   proprio la parte interessante.
3. **Repo privato + repo pubblico solo per il deploy.** Massima libertà, addio
   vetrina.

Nota sulla storia: quel materiale è già nei commit pubblici. Toglierlo da qui in
avanti non lo cancella — servirebbe riscrivere la storia (`git filter-repo`) e un
push forzato, con i fork e le cache di GitHub che possono comunque conservarlo.
Da valutare se ne vale la pena: il contenuto attuale è imbarazzante più che
rischioso.

## Nota tecnica emersa

~~Self-hostare i font caricati da Google Fonts~~ — fatto: tutti i font sono in
`src/assets/fonts/` in WOFF2, con il testo OFL accanto a ciascuno. Resta una
richiesta a terzi: lo script di Umami (`cloud.umami.is`) in `index.html:73`.
