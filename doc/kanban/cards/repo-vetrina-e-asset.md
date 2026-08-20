# Ripulire il repo come vetrina (asset di terzi + presentazione)

Il repo è pubblico e serve anche da portfolio. La licenza CC BY-NC-SA 4.0
(`LICENSE`) e l'elenco degli asset di terzi (`NOTICE`) sono già a posto, ma
restano aperti questi punti.

## Asset di terzi ancora nel repo

- ~~**`src/assets/fonts/EdwardianScriptITC.ttf`**~~ — fatto: sostituito da
  Corinthia (OFL), self-hostato. Anche DM Serif Display e Courier Prime non
  arrivano più da Google Fonts. Pinyon Script era il finalista alternativo,
  recuperabile da `3a0be78`.
- **`src/assets/inner/images/bg.jpg`** e **`bg_original.jpg`** — texture pergamena
  di zikku.creative da Vecteezy. La Vecteezy License chiede attribuzione e vieta
  di ridistribuire l'asset da solo o di sublicenziarlo. Alternative libere:
  texture CC0 da Unsplash/Pexels, oppure generarla in GIMP/procedurale.
  Lo stesso JPEG è embeddato in base64 dentro `inner.svg` e `outer.svg`: vanno
  rigenerati insieme al file.

Finché lo sfondo resta, il `NOTICE` lo esclude dalla licenza del repo: chi clona
non può riusarlo. È l'ultimo asset di terzi rimasto.

Le icone (`compass.png`, `palm.png`, `ship.png`, `vulcan.png`,
`doc/data/map-icons.svg`) sono opera originale: nessun vincolo, coperte dalla
licenza del repo. Verificato con l'autore, non serve rifarle.

## Presentazione

- **`README.md` è ancora il boilerplate di Vite.** È la prima cosa che si legge
  arrivando sul repo e non dice nulla di qriddle. Riscriverlo: cos'è, screenshot,
  link a https://danilosanchi.net/qriddle/, come funziona l'algoritmo, come
  girarlo in locale, licenza.
- **`package.json` si chiama ancora `vite-temp`.** Rinominare in `qriddle`.
- **`doc/tmp/`** contiene materiale di scarto (webp di lavorazione, il prototipo
  `qr-puzzle-generator-fixed.html`). Decidere se archiviarlo o toglierlo dal repo.

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
