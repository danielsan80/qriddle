# Escape non annulla la modifica del testo

Nell'editor di testo sulle facciate del biglietto, **Escape si comporta esattamente come
Enter**: chiude l'overlay e tiene quello che hai appena scritto. Chi usa l'applicazione si
aspetta che Escape butti via la modifica.

`SvgTextEditor.tsx:316-319`:

```tsx
onKeyDown={(event) => {
  if (event.key === 'Enter' || event.key === 'Escape') stopEditing();
}}
```

## Prima di correggere: c'è un motivo?

Quello che dice la storia di git: la riga nasce già così nello spike `83103e4`
(2026-03-18), passa per `add CenterView` e `add FrontView`, viene spostata di file da
`1b459d7 extract SvgTextEditor` e da allora non è più stata toccata. Non risulta nessuna
commit che abbia scelto questo comportamento — sembra la scorciatoia di uno spike
sopravvissuta all'estrazione, non una decisione.

Resta da verificare la cosa che git non può dire: se annullare complichi il salvataggio
verso l'URL. Le caselle della facciata esterna passano da `useOuterTextBoxes`, e lo stato
del biglietto finisce compresso nell'hash — va guardato se il testo precedente sia ancora
recuperabile al momento della chiusura o se sia già stato propagato.

## Se è un bug

Servono due comportamenti distinti, perché "annullare" vuol dire due cose diverse:

- casella **appena creata** — Escape la elimina. Oggi già succede, ma per un altro
  motivo: `stopEditing` scarta le caselle con testo vuoto, non perché tu abbia annullato.
  Se scrivi qualcosa e poi premi Escape, la casella resta.
- casella **esistente** — Escape rimette il testo che c'era all'apertura. Oggi non è
  possibile: `EditingState` tiene `id`, `overlayX` e `overlayY`, non il testo di partenza.
  Va aggiunto lì.

Da decidere anche cosa fa il **blur**, che oggi chiude e tiene (con `suppressNextClick`):
se Escape annulla, cliccare fuori è un salvataggio o un annullamento? Le due cose devono
essere coerenti fra loro, non decise una alla volta.

Nota dalla lettura guidata del 2026-09-02, come argomento a favore di **lasciare il blur
com'è**: oggi ci sono tre modi per confermare (Enter, Escape, blur) e zero per annullare.
Ma il blur è l'unico dei tre che non esprime una volontà — l'utente ha guardato altrove,
non ha detto cosa voleva di quel testo. Un'azione distruttiva non dovrebbe stare dietro il
gesto ambiguo: il blur resta un salvataggio, l'annullamento richiede un atto esplicito.

## Card collegate

- [L'overlay di modifica non segue lo zoom](overlay-non-segue-lo-zoom.md) lavora sulla
  stessa struttura: toglie due campi a `EditingState`, questa card ne aggiunge uno (il
  testo di partenza). Meglio farla prima.
- [Un click perso dopo aver chiuso l'editor](click-perso-dopo-blur-editor.md) tocca lo
  stesso percorso di chiusura per blur.

## Test

Il comportamento attuale è fissato da `SvgTextEditor.test.tsx`, in
`closes the editor on %s, keeping the text that was typed`, che gira su entrambi i tasti.
Non è un test da aggirare: se si cambia il comportamento **quel test deve fallire**, ed è
lì apposta perché il cambiamento sia deliberato. Va riscritto separando i due tasti, non
cancellato.
