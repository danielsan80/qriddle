# Coprire `drawTextBox`: la facciata centrale ruotata

`renderPdf.ts` è il file meno coperto del progetto: **24,67% statement, 0% branch,** 36,36%
funzioni. Zero di branch significa che questo non è provato da niente:

```ts
// renderPdf.ts:86
if (tb.face === 'center') {
```

È l'**unico consumatore a runtime** del campo `face`. La facciata centrale si stampa
capovolta perché il biglietto si piega, e quella rotazione è l'unica cosa che il campo
serve a decidere. Il 2026-09-03 quel campo è passato dall'editor al genitore ed è diventato
obbligatorio in `FacedTextBox`: il compilatore ha dimostrato che i tipi combaciano, nessuno
ha dimostrato che il disegno esca giusto.

## Cosa fissare

- una casella con `face: 'center'` viene disegnata capovolta: `translate` all'angolo
  opposto, `rotate(Math.PI)`, `fillText` all'origine, dentro una coppia `save`/`restore`;
- una casella di qualsiasi altra facciata viene disegnata dritta, con `fillText` alle sue
  coordinate scalate, e **senza** toccare la trasformazione;
- una casella con solo spazi non viene disegnata affatto (`if (!tb.text.trim()) return`).

## Come

Niente canvas: jsdom non lo implementa (lo dice a ogni run, `HTMLCanvasElement's
getContext() method` non implementato). Il contesto è solo un oggetto con dei metodi, quindi
si passa un finto `ctx` con `vi.fn()` su `save`, `restore`, `translate`, `rotate`,
`fillText` e un `font` scrivibile, e si asserisce sulla **sequenza di chiamate**, non su
un'immagine.

Ostacolo: `drawTextBox` non è esportato, e nemmeno `drawTextBoxes`. Le tre funzioni
esportate (`renderInnerPdfPreview`, `renderOuterPdfPreview`, `downloadPuzzlePdf`) tirano
dentro jsPDF, il caricamento dei font e delle immagini — troppo per arrivare a una
rotazione. Va esportato `drawTextBox`, che è la cosa da provare.

Coerente con l'asserzione sul valore intero: si asserisce sull'array delle chiamate
registrate, non su un metodo alla volta.

## Perché è la volta buona

La card [Modifiche perse tornando indietro](modifiche-perse-tornando-indietro.md) mette in
dubbio proprio l'integrità di ciò che arriva fin qui. Se quello che entra in `drawTextBox`
è sbagliato, questo test non lo dice — ma almeno separa i due dubbi invece di lasciarli
sovrapposti.
