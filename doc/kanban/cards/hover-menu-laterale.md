# Hover sulle voci del menu laterale

Chiesto il 2026-09-24 (card Trello "QRiddle bugs"): le voci di `TrackNav` non reagiscono
al passaggio del mouse.

Non è una regressione: dalla nascita (`9629bad`) l'unico `:hover` in
`TrackNav.module.css` è sul pulsante `.next`; `.label` non ne ha mai avuto uno.

Da allineare all'hover delle sezioni del foglio
([L'hover sulle sezioni del foglio non si vede](hover-sezioni-del-foglio.md)), così le due
navigazioni rispondono allo stesso modo.

## Correzione

Cambia solo il nome: in `--accent` e, sui passi futuri, a piena opacità. Il tracciato resta
com'è, perché un tratteggio acceso stona. Per questo l'opacità dei passi futuri è passata
dalla riga intera a tracciato e nome separati. Il passo corrente non ha hover.
