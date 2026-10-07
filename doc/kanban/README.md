# Kanban

Board di progetto: feature, idee, infrastruttura. Ogni card è una riga di questo
indice + un file in [`cards/`](cards). Le card completate finiscono archiviate in
[DONE.md](DONE.md).

Regole d'uso in `.claude/skills/kanban/SKILL.md`, o `/kanban` da Claude Code.

## IDEAS

## BACKLOG

### Bug

- [Escape non annulla la modifica del testo](cards/escape-non-annulla-la-modifica.md)
- [Un click sull'anteprima va perso dopo aver chiuso l'editor cliccando altrove](cards/click-perso-dopo-blur-editor.md)
- [L'overlay di modifica non segue lo zoom](cards/overlay-non-segue-lo-zoom.md)
- [`useOuterTextBoxes`: l'ordine cambia da solo, e ogni vista ha la sua copia](cards/ordine-e-copia-in-useoutertextboxes.md)
- [Modificare una facciata cancella quelle successive](cards/modifiche-perse-tornando-indietro.md)

### Refactoring

- [Debito di revisione: policy e copertura dell'editor SVG](cards/debito-di-revisione-editor-svg.md)
- [Scomporre `CardFaceEditor` in comportamenti isolati](cards/scomporre-cardfaceeditor.md)

### Feature

- [Revisione della comunicazione della prima vista (Intro)](cards/revisione-comunicazione-intro.md)
- [Multipuzzle: QR diviso in 4 settori](cards/multipuzzle-4-settori.md)
- [Stili puzzle alternativi](cards/stili-puzzle-alternativi.md)
- [Rivedere il tipo `Face` in `CardFaceNav`](cards/tipo-face-cardfacenav.md)
- [Altri font per i testi del biglietto](cards/altri-font.md)
- [Ruotare le scritte](cards/rotazione-scritte.md)

### Tech

- [Linkare il progetto dalla GitHub Pages principale (sezione "Lab")](cards/link-github-pages-lab.md)
- [Ripulire il repo come vetrina (asset di terzi + presentazione)](cards/repo-vetrina-e-asset.md)
- [Potare i commenti nei test dell'editor](cards/potare-i-commenti-nei-test.md)
- [Coprire `drawTextBox`: la facciata centrale ruotata](cards/test-su-drawtextbox.md)

### Operations

- [Strascichi del cambio di dominio](cards/strascichi-cambio-dominio.md)
- [Proporre QRiddle su Reddit](cards/proposta-su-reddit.md)

### Spike

- [Mutation testing con Stryker](cards/spike-stryker.md)
- [Revisione dello stile: enigmistica o pirati?](cards/revisione-dello-stile.md)
- [Download SVG modificabile](cards/spike-download-svg-modificabile.md)
- [Un PageObject per i test dei componenti?](cards/spike-pageobject-nei-test.md)

## DOING

## DONE

- [Spostare l'app su qriddle.app](cards/dominio-qriddle-app.md)
- [Un esempio di coordinate più noto e più universale](cards/esempio-coordinate-universale.md)
- [Far capire che il link è il lavoro salvato](cards/persistenza-e-condivisione.md)
- [Bottone di download più evidente](cards/bottone-download-evidente.md)
- [Hover sulle voci del menu laterale](cards/hover-menu-laterale.md)
- [L'hover sulle sezioni del foglio non si vede](cards/hover-sezioni-del-foglio.md)
- [Chiarire l'API di `CardFaceEditor`: nome, prop obbligatorie, `face`](cards/api-cardfaceeditor.md)
