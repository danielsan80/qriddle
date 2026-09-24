# L'hover sulle sezioni del foglio non si vede

Segnalato il 2026-09-24 (card Trello "QRiddle bugs"): passando sopra le sezioni del foglio
in `CardFaceNav` non succede niente; l'etichetta dovrebbe virare al rosso.

## Causa probabile

`a7c6461` (2026-03-20, "change sidebar text colors") ha sostituito `--grid` con `--paper`
anche dentro gli hover:

```css
background: color-mix(in srgb, var(--paper) 25%, var(--paper));
```

Un colore mischiato con sé stesso resta lui: lo sfondo in hover è identico a quello a
riposo. Tre occorrenze in `CardFaceNav.module.css` (`.inner`, `.center .quadrant`,
`.quadrant`).

L'etichetta rossa in hover, invece, non c'è mai stata: `color: var(--accent)` compare solo
in `.selected`. Da decidere se l'hover deve anticipare la selezione (etichetta in
`--accent`) o restare un cambio di sfondo.

## Correzione

Hover come anteprima della selezione: etichetta in `--accent`, sfondo con metà della tinta
di `.selected` (`--accent` al 6% sul paper invece del 12%).
