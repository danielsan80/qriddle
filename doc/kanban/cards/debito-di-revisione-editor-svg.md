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
che funziona. Da qui il debito di verifica è quantificato — e la lettura guidata resta
comunque da fare, perché i due debiti sono distinti.

Ripagare significa due cose distinte:

- test dedicati sul comportamento dell'editor (il debito di _verifica_);
- una lettura guidata del componente con Claude (il debito di _conoscenza_).
