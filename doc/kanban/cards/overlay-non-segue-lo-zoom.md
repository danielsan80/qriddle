# L'overlay di modifica non segue lo zoom

Con l'editor di testo aperto, girando la rotella sopra l'anteprima l'SVG si ridimensiona e
il testo si sposta, ma **la casella di input resta dov'era**. Si scollega dal testo che sta
modificando.

## Causa

`CardFaceEditor.tsx`. La posizione dell'overlay è memorizzata all'apertura e non più
toccata:

Righe 19-23:

```ts
interface EditingState {
  id: string;
  overlayX: number; // pixel relativi al contenitore, calcolati una volta sola
  overlayY: number;
}
```

Sono **le uniche coordinate memorizzate di tutto il componente**. Tutte le altre vengono
derivate al momento dell'uso: `getScreenCTM()` e `getBoundingClientRect()` sono richiamate
a ogni click e a ogni movimento del mouse, ed è per questo che lo zoom funziona ovunque
tranne qui. Lo zoom cambia la geometria da cui quei due numeri derivano e non ha nessun
modo di raggiungerli.

## Direzione per la correzione

`overlayX`/`overlayY` **non sono informazione**: sono derivabili. Coincidono sempre con la
posizione della casella convertita in pixel del contenitore, sia quando l'editor si apre su
una casella esistente (158-164, che è già scritto così) sia quando nasce da un click
(209-213, che ci arriva per un'altra strada ma allo stesso punto).

Quindi la correzione toglie stato invece di aggiungerne:

```ts
interface EditingState {
  id: string;
}
```

...e l'overlay calcola `svgToContainer(svgEl, containerEl, editingBox.x, editingBox.y)`
al momento di renderizzarsi. Va ricalcolato anche quando cambia `widthPx`, quindi
probabilmente in un `useLayoutEffect` su `[editing?.id, widthPx]` — durante il render la
misura disponibile è quella del commit precedente.

Effetto collaterale gradito: `handleSvgClick` smette di duplicare la conversione fatta da
`svgToContainer`.

## Interazioni

- [Escape non annulla la modifica](escape-non-annulla-la-modifica.md) vuole **aggiungere**
  un campo a `EditingState` (il testo di partenza). Le due card lavorano sulla stessa
  struttura: questa ne toglie due campi, quella ne aggiunge uno. Meglio farle in
  quest'ordine.
- [Scomporre `CardFaceEditor`](scomporre-cardfaceeditor.md): con la posizione derivata,
  l'overlay diventa molto più facile da estrarre in un componente a sé.

## Come si è trovata

Dedotta leggendo il componente (lettura guidata del 2026-09-02): nessun percorso di codice
scrive `overlayX`/`overlayY` dopo l'apertura. La dimostrazione è per assenza, non serve un
test per confermarla — ma un test in jsdom sarebbe fragile, perché senza layout reale
andrebbe simulato il ridimensionamento con degli stub, e proverebbe cose sugli stub.
