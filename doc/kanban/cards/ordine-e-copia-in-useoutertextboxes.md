# `useOuterTextBoxes`: l'ordine cambia da solo, e ogni vista ha la sua copia

Due cose emerse leggendo l'hook il 2026-09-03, nessuna delle due decisa da qualcuno.
Dimostrate leggendo, non da un test.

L'hook è una lente su un blob solo: nell'URL c'è l'array di **tutte** le caselle del
biglietto, e ogni vista ne vede la fetta della propria facciata.

```ts
function setFaceBoxes(newFaceBoxes: TextBox[]) {
  setTextBoxes((prev) => [
    ...prev.filter((tb) => tb.face !== face),
    ...newFaceBoxes.map((tb) => ({ ...tb, face })),
  ]);
}
```

## 1. Ogni salvataggio manda la propria fetta in coda

Se l'array è `[front, center]` e si modifica il front, diventa `[center, front]`. Succede a
ogni battuta di tasto, perché la scrittura passa da qui ogni volta.

L'ordine dell'array è l'ordine di disegno: `renderPdf` lo scorre così com'è. Con due
caselle sovrapposte cambia quale finisce sopra, e cambia in base a quale facciata hai
toccato per ultima. In più l'URL si rimescola più di quanto servirebbe.

Correzione probabile: ricomporre mantenendo la posizione invece di concatenare, o ordinare
in modo stabile alla lettura. Da decidere se l'ordine debba avere un significato dichiarato
(z-order) o essere irrilevante per costruzione.

## 2. Il "una vista per volta" è un invariante non scritto

Ogni chiamata a `useOuterTextBoxes` fa `useState` seminato dall'URL, quindi front, center e
back terrebbero **tre copie indipendenti dell'array intero**. Non si pestano i piedi per un
motivo solo: `StepView` è uno `switch` che monta una vista per volta, quindi le copie non
coesistono mai e chi si monta rilegge l'URL aggiornato.

Il giorno che due facciate compaiono insieme — un'anteprima affiancata, una vista di
riepilogo — l'ultima che scrive cancella le modifiche dell'altra, in silenzio.

Almeno va dichiarato. Meglio ancora: togliere il presupposto, tenendo lo stato in un posto
solo sopra le viste invece di una copia per hook.

## Card collegate

- [Chiarire l'API di `CardFaceEditor`](api-cardfaceeditor.md) — il timbro della facciata è
  arrivato in questo hook il 2026-09-03, ed è la ragione per cui ci si è guardato dentro.
