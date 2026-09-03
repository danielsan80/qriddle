# Chiarire l'API di `CardFaceEditor`: nome, prop obbligatorie, `face`

Il componente ha una superficie che promette più di quello che serve, e le tre cose sotto
sono la stessa decisione detta tre volte: **smettere di far finta che sia generico.**

Non lo è, e va bene così — è l'editor delle facciate del biglietto, non un editor di testo
su SVG qualsiasi. Lo dice il codice stesso, che alle righe 276-280 legge `cardFontFamily` e
`config.pdf.textColor`. Il problema non è la contestualizzazione, è che la superficie non
la dichiara.

## 1. Il nome

`SvgTextEditor` suona come un componente riusabile. Un nome che dica di cosa si occupa
toglie l'ambiguità senza toccare una riga di logica.

Deciso (2026-09-03): **`CardFaceEditor`**. Sta accanto a `CardFaceNav`, che esiste già, e usa il
vocabolario del dominio.

Attenzione a una collisione che questa rinomina rende più visibile: nel progetto ci sono
**due tipi esportati che si chiamano `Face`** e non sono lo stesso tipo.

- `SvgTextEditor.tsx:8` — `'front' | 'center' | 'back'`
- `navigation/CardFaceNav/CardFaceNav.tsx:11` — derivato da `FACES`, con la forma a punto
  (`'outer.front'`…), oggetto della card
  [Rivedere il tipo `Face` in `CardFaceNav`](tipo-face-cardfacenav.md)

Le due card non si sovrappongono, ma conviene sapere che il nome è occupato due volte.

## 2. Prop opzionali che in produzione ci sono sempre

```ts
textBoxes?: TextBox[];
onTextBoxesChange?: (boxes: TextBox[]) => void;
face?: Face;
```

Tutti e tre i chiamanti (`FrontView`, `CenterView`, `BackView`) li passano tutti e tre.
Renderli **obbligatori** significa cancellare il ramo non controllato: `controlled` (66)
diventa sempre vero, `internalBoxes` (65) sparisce, e `setTextBoxes` (69-76) si riduce a
una riga.

Una cosa da sapere prima di farlo, perché è controintuitiva: **il ramo che sopravvive è
quello con la semantica più debole.**

```ts
function setTextBoxes(updater: (prev: TextBox[]) => TextBox[]) {
  const next = updater(textBoxes); // applicato subito alla base di questo render
  if (controlled) {
    onTextBoxesChange?.(next); // al genitore arriva un valore
  } else {
    setInternalBoxes(updater); // a React arriva l'updater: accodato correttamente
  }
}
```

Ha la forma di un `setState` funzionale ma nel ramo controllato non ne ha le garanzie: due
chiamate prima di un nuovo render partono dalla stessa base e la seconda cancella la prima.

In pratica non morde, perché quasi tutti gli aggiornamenti sono scritti in forma
**assoluta** — il drag ricalcola da `drag.startBoxX` invece che dalla posizione precedente
(139), quindi è idempotente. L'unico incrementale è `handleFontSize`:

```ts
Math.max(3, Math.min(24, tb.fontSize + delta)); // 243
```

Da tenere d'occhio quando si toglie l'altro ramo: è l'unico punto dove la differenza
sarebbe osservabile.

Conseguenza sui test: il caso `without a parent holding the boxes` in
`SvgTextEditor.test.tsx` va tolto insieme al ramo che copre.

## 3. Togliere `face`

`face` viene usato **una volta sola**, per timbrare la casella appena creata:

```ts
...(face !== undefined && { face }),   // 205
```

L'editor non lo legge mai. È un'etichetta che serve solo al genitore per ritrovare le sue
caselle al giro successivo — e il genitore la conosce già:

```ts
// useOuterTextBoxes.ts:24-29
function setFaceBoxes(newFaceBoxes: TextBox[]) {
  setTextBoxes((prev) => [
    ...prev.filter((tb) => tb.face !== face),
    ...newFaceBoxes,
  ]);
}
```

Basta timbrarle lì (`...newFaceBoxes.map((tb) => ({ ...tb, face }))`) e il prop sparisce
dall'editor.

Da verificare come conseguenza: se dopo questo `TextBox.face` possa diventare obbligatorio
nel tipo, controllando chi lo legge — `renderPdf.ts` e `DownloadView.tsx`.

## Ordine

Prima questa card, che riduce la superficie, poi
[Scomporre `CardFaceEditor`](scomporre-cardfaceeditor.md), che lavora sull'interno: c'è meno
roba da spostare.

## Fatto (2026-09-03)

Tutti e tre i punti, un commit ciascuno, dal più meccanico al più invasivo. Più un quarto
che è nato dalla verifica del terzo.

1. `7d8d4fe` **rinomina** in `CardFaceEditor` — cartella, file, componente e i sette punti
   che lo importano. Fatta con `git mv`, così la storia segue i file. Suite invariata.
2. `ecdc3fe` **prop obbligatorie** — via `internalBoxes`, `controlled` e il ternario;
   `setTextBoxes` resta una riga. Con il ramo se n'è andato il test che lo copriva, che
   però ospitava anche l'unica verifica dell'invito `Click to add text`: rimessa fra i test
   del ciclo di vita, e con il viaggio di ritorno (l'invito ricompare cancellando
   l'ultima casella).
3. `d6588e4` **`face` al genitore** — il timbro è in `useOuterTextBoxes.setFaceBoxes`.
4. `f47dae5` **due tipi** — la verifica del punto 3 ha dato risposta **negativa**:
   `TextBox.face` non poteva diventare obbligatorio, perché l'editor ora crea caselle senza
   facciata per costruzione. I due obiettivi si escludevano, e li riconcilia una coppia di
   tipi: `TextBox` (l'editor, senza facciata) e `FacedTextBox` (l'archivio, facciata
   obbligatoria). Chiamato così e non `OuterTextBox` perché `outer` in questo progetto è il
   lato del foglio, mentre ciò che distingue il tipo è avere una facciata.

Suite da 126 a 127 test, verdi.

**Il tipo `Face` non è sparito, è traslocato**: adesso lo esporta `useOuterTextBoxes`
invece di `CardFaceEditor`, perché è il suo parametro. La collisione con il `Face` di
`CardFaceNav` resta esattamente com'era —
[Rivedere il tipo `Face` in `CardFaceNav`](tipo-face-cardfacenav.md).

Aperta lungo la strada:
[`useOuterTextBoxes`: l'ordine cambia da solo](ordine-e-copia-in-useoutertextboxes.md).
