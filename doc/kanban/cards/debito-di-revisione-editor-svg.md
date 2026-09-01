# Debito di revisione: policy e copertura dell'editor SVG

Policy dichiarata (2026-08-25, discussione in life-hacks):

- **CSS** — delega permanente: non si revisiona, non è debito.
- **SvgTextEditor** — debito di revisione reale, accettato ma da ripagare; in priorità
  sta sotto promozione e perfezionamento.

Stato rilevato (2026-08-25): `SvgTextEditor.tsx` (351 righe) non ha test dedicati. È
esercitato indirettamente da `FrontView.test.tsx` e `useOuterTextBoxes.test.ts`, ma è
usato anche da `BackView`, `CenterView`, `DownloadView` e `renderPdf`. La copertura reale
va misurata con un run `--coverage` prima di dichiararla sufficiente.

Ripagare significa due cose distinte:

- test dedicati sul comportamento dell'editor (il debito di _verifica_);
- una lettura guidata del componente con Claude (il debito di _conoscenza_).
