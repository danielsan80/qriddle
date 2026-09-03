# Scomporre `CardFaceEditor` in comportamenti isolati

351 righe in un file solo, con dentro almeno quattro cose indipendenti. L'obiettivo non è
la lunghezza: è che ogni pezzo si possa capire **senza tenere in testa gli altri tre**.

## Le giunture

Sembrano nette, ognuna con un solo motivo per esistere:

**`useSvgZoom(svgRef, containerRef)` → `widthPx`** (righe 94-113)
Il listener `wheel` registrato a mano con `{ passive: false }`, il fattore 1,1, i limiti fra
100px e la larghezza del contenitore, e lo specchio `widthPxRef`. Non tocca le caselle di
testo, non sa che esistono. È il pezzo più facile da staccare.

**`useBoxDrag({ svgRef, ... })`** (82, 117-175, 217-231)
`dragRef`, la soglia di 4px in distanza di Manhattan, il fermo `moved`, i listener su
`window`, e gli effetti su `document.body.style`. Espone due esiti: _è stato un
trascinamento_ (aggiorna la casella) e _è stato un click_ (apri l'editor). Il secondo va
fuori come callback.

**`<TextBoxOverlay>`** (303-348)
L'input, i tre bottoni, e i tre `preventDefault` che li tengono in vita. Props: la casella,
la posizione, e i quattro esiti (testo cambiato, corpo cambiato, cancellata, chiusa).

**Quello che resta nel file principale**: l'SVG, i nodi `<text>`, `handleSvgClick`,
`stopEditing` e le conversioni di coordinate. Circa un terzo di adesso.

## L'avvertenza

C'è un invariante che attraversa tre di questi pezzi e **non ha un nome da nessuna parte**:

> Un gesto dell'utente non deve produrre due effetti.

Un click che chiude l'editor non deve anche crearne uno nuovo; un mousedown che afferra una
casella non deve anche crearne una; un click su un bottone non deve smontare il bottone
prima di raggiungerlo. È difeso da tre meccanismi lontani fra loro:

```
justClosedRef                        187-190, 315   il click che segue un blur
la guardia tagName === 'text'        191            il click che segue un trascinamento
i preventDefault sul mousedown       325, 333, 342  il blur che precede un click sulla toolbar
```

Scomporre **non deve nascondere questo accoppiamento**. `justClosedRef` sta esattamente fra
il blur dell'overlay e il click dell'SVG: se l'overlay va in un altro file, quel flag
attraversa il confine. La giuntura giusta lo rende esplicito — l'overlay dice _mi sto
chiudendo, e per quale motivo_, e chi possiede l'SVG decide cosa farne — non lo maschera
dietro un `useEffect` condiviso.

Se dopo la scomposizione l'invariante non è nominato in nessun punto, il refactoring ha
peggiorato le cose invece di migliorarle. Nominarlo è metà del lavoro.

## Prerequisiti

- [Chiarire l'API di `CardFaceEditor`](api-cardfaceeditor.md) — prima: riduce la superficie da
  spostare.
- [L'overlay di modifica non segue lo zoom](overlay-non-segue-lo-zoom.md) — la sua
  correzione rende l'overlay derivabile dalla sola casella, quindi molto più facile da
  estrarre.

## Perché vale la pena

Nasce dalla lettura guidata del 2026-09-02, che ha lasciato scoperto il debito di
conoscenza — vedi
[Debito di revisione: policy e copertura dell'editor SVG](debito-di-revisione-editor-svg.md).
La scommessa è che quattro pezzi da leggere uno alla volta si capiscano anche senza dominare
il modello di eventi del browser, che è quello che serve oggi per leggere il file intero.
