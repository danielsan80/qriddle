# Debito di revisione: policy e copertura dell'editor SVG

Policy dichiarata (2026-08-25, discussione in life-hacks):

- **CSS** — delega permanente: non si revisiona, non è debito.
- **SvgTextEditor** — debito di revisione reale, accettato ma da ripagare; in priorità
  sta sotto promozione e perfezionamento.

Stato rilevato (2026-08-25): `SvgTextEditor.tsx` (351 righe) non ha test dedicati. È
esercitato indirettamente da `FrontView.test.tsx` e `useOuterTextBoxes.test.ts`, ma è
usato anche da `BackView`, `CenterView`, `DownloadView` e `renderPdf`. La copertura reale
va misurata con un run `--coverage` prima di dichiararla sufficiente.

Misurata (2026-09-01, `npm run coverage`): **27,55% statement, 14,28% branch, 16,66%
funzioni**, contro il 62% del progetto. Di 42 funzioni ne sono esercitate 7, e sono tutte
di montaggio: il render iniziale, il ridimensionamento, la registrazione dei listener.
Non è coperto niente di quello che l'editor fa davvero:

- `handleSvgClick` — creare una casella cliccando sull'SVG (righe 186-215);
- `onMouseMove` / `onMouseUp` / `handleTextMouseDown` — trascinare una casella, con la
  soglia oltre cui il drag smette di essere un click (118-167, 217-231);
- `handleTextChange`, `handleFontSize` (con il clamp 3-24), `handleDelete` (233-252);
- `stopEditing` e il flag `justClosedRef` che impedisce alla chiusura dell'overlay di
  creare subito una casella nuova (177-184);
- `onWheel`, lo zoom con il clamp fra 100px e la larghezza del contenitore (103-109);
- tutto l'overlay di editing e la sua toolbar (270-343).

L'indiretto quindi non basta: i test attuali dimostrano che il componente si monta, non
che funziona. Correzione allo stato rilevato sopra: `FrontView.test.tsx` non lo esercita
affatto, lo sostituisce con `vi.mock`, e `useOuterTextBoxes.test.ts` ne importa solo il
tipo `TextBox`. Quel 27% arriva tutto da `StepView.test.tsx`, che rende per davvero
`CenterView`, `BackView` e `DownloadView`.

## Fatto

- **Soglia di drag** (2026-09-01, `SvgTextEditor.test.tsx`): tre test sul confine fra
  click e trascinamento — a 4px di spostamento è un click e apre l'editor senza muovere
  la casella, a 5px è un drag, sposta la casella dividendo per la scala della CTM e non
  apre l'editor; più il cursore `grabbing` messo e rimesso a posto. Verificato che hanno
  presa: portando `DRAG_THRESHOLD` da 4 a 40 ne falliscono due.
  Copertura del componente **27,55% → 59,05%** statement, 14,28% → 46,03% branch,
  16,66% → 42,85% funzioni.

Restano scoperti `handleSvgClick`, l'overlay di editing con la sua toolbar
(`handleTextChange`, `handleFontSize`, `handleDelete`), `stopEditing` col flag
`justClosedRef`, e `onWheel`.

- **Copertura completata** (2026-09-01, `SvgTextEditor.test.tsx`): ciclo di vita delle
  caselle, chiusura per blur con la guardia del click, `preventDefault` su tutti e tre i
  bottoni della toolbar, zoom fra i suoi due limiti, ramo non controllato. 19 test in 5
  gruppi. Copertura del componente **97,63% statement, 85,71% branch, 100% funzioni, 100%
  righe**. Lasciate scoperte di proposito le due guardie `if (!drag) return` (119, 148) e
  il ramo `face !== undefined`: sono difensive, un test lì dimostrerebbe soprattutto che il
  test funziona.

Ripagare significa due cose distinte: test dedicati sul comportamento dell'editor (il
debito di _verifica_) e una lettura guidata del componente (il debito di _conoscenza_). Il
primo è ripagato. Il secondo no — vedi sotto.

## Lettura guidata (2026-09-02): fatta, debito non chiuso

Percorso in sette tappe: identità e chiamanti, topologia dello stato, sistemi di
coordinate, macchina del drag, chiusura dell'editor, zoom, sintesi.

**Il debito di conoscenza resta aperto.** Le tappe dalla quarta in poi poggiano sul modello
degli eventi del browser (ordine di `mousedown`/`blur`/`click`, listener passivi, bersaglio
del click dopo un trascinamento) e su geometria affine. Non è materiale che si assorba in
una lettura, e approfondirlo non è l'obiettivo attuale. La scommessa è che scomporre il
componente renda i pezzi leggibili anche senza dominare quel modello: card
[Scomporre `SvgTextEditor`](scomporre-svgtexteditor.md).

### Le due regole non scritte del componente

- **Non memorizzare mai una coordinata, derivala al momento dell'uso.** `getScreenCTM()` e
  `getBoundingClientRect()` sono richiamate a ogni uso; è per questo che lo zoom funziona
  ovunque senza che nessuno lo propaghi. Unica violazione: `editing.overlayX/overlayY`.
- **Un gesto dell'utente non deve produrre due effetti.** Difeso da tre meccanismi
  indipendenti e mai nominati come una cosa sola: `justClosedRef`, la guardia
  `tagName === 'text'` (191), i `preventDefault` sul mousedown dei bottoni.

Entrambe le regole hanno prodotto una card: la prima
[L'overlay non segue lo zoom](overlay-non-segue-lo-zoom.md), la seconda
[Un click perso dopo aver chiuso l'editor](click-perso-dopo-blur-editor.md).

### Anomalie minori, da correggere quando si passa di lì

Tre righe di correzione ciascuna, nessuna merita una card a sé.

- **`document.body.style` non viene ripristinato allo smontaggio.** Il trascinamento scrive
  `cursor: grabbing` e `userSelect: none` sul body (127-128) e li ripulisce nel `mouseup`
  (151-152), ma la pulizia dell'effetto (171-174) toglie solo i listener. Se il componente
  si smonta a trascinamento in corso, la pagina resta con il cursore sbagliato e il testo
  non selezionabile. Poco raggiungibile, ma è un effetto globale senza ripristino.
- **Lo scorrimento orizzontale ingrandisce.** `event.deltaY > 0` (105) è falso anche per
  `deltaY === 0`, quindi una rotella laterale o shift+rotella finisce nel ramo "ingrandisci"
  — e il `preventDefault` le impedisce pure di scorrere.
- **La prima rotellata congela la responsività.** Finché `widthPx` è `null` la larghezza
  viene da `.preview { width: 25% }` e segue il contenitore; al primo colpo di rotella lo
  stile in linea (263) la fissa in pixel per sempre. Il limite superiore è applicato solo
  nel momento della rotellata, quindi restringendo poi la finestra l'SVG può eccedere il
  contenitore.

### Ipotesi non dimostrabile in jsdom

Dopo un trascinamento il browser emette il `click` sul primo antenato comune di mousedown e
mouseup. Funziona perché il testo insegue il cursore, quindi il bersaglio resta il `<text>`
e la guardia alla riga 191 lo ferma. Con un movimento abbastanza rapido perché il render
resti indietro, il rilascio potrebbe cadere a fianco del glifo e far nascere una casella
fantasma. Serve un browser vero per verificarlo: jsdom non fa hit testing.

### Osservazioni strutturali confluite in altre card

Nome che promette genericità, prop opzionali sempre passate, `face` timbrato dall'editor e
letto solo dal genitore: [Chiarire l'API di `SvgTextEditor`](api-svgtexteditor.md).
Duplicazione della conversione client↔contenitore: assorbita da
[L'overlay non segue lo zoom](overlay-non-segue-lo-zoom.md).

Restano senza casa, come note di lettura e basta:

- il drag assume `b = c = 0` nella CTM (scala pura, niente rotazione) e nessun commento lo
  dice;
- "cancella svuotando" è una funzionalità non dichiarata, nata come effetto collaterale del
  filtro sulle caselle vuote in `stopEditing` (180-182), e vale anche per le caselle
  esistenti;
- il doppio `stopEditing` scatenato dal mousedown su un'altra casella mentre se ne modifica
  una funziona sotto due ordinamenti di eventi diversi, per due motivi diversi, e non
  sappiamo quale dei due avvenga davvero.
