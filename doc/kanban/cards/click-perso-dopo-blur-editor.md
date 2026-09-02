# Un click sull'anteprima va perso dopo aver chiuso l'editor cliccando altrove

Sintomo: si clicca sull'anteprima per creare una casella di testo e **non succede niente**.
Si clicca una seconda volta e funziona.

Come riprodurlo:

1. clicca sull'anteprima, scrivi qualcosa nella casella
2. clicca su qualcosa **fuori dall'SVG** — un altro pannello, la navigazione fra le
   facciate, il tasto Tab, o anche solo passare a un'altra finestra
3. torna sull'anteprima e clicca per creare una casella nuova → il click viene ignorato
4. clicca ancora → adesso la casella nasce

## Causa

`SvgTextEditor.tsx`. Il blur dell'input chiude l'editor e arma un flag:

```tsx
onBlur={() => stopEditing({ suppressNextClick: true })}   // 315
```

```ts
if (suppressNextClick) justClosedRef.current = true; // 179
```

L'unico posto che lo disarma è il gestore del click sull'SVG (187-190):

```ts
if (justClosedRef.current) {
  justClosedRef.current = false;
  return;
}
```

Il flag serve, e va tenuto. Risolve un problema reale: cliccando sull'SVG mentre si sta
scrivendo, il browser produce `mousedown → blur → mouseup → click`, cioè lo stesso gesto
chiuderebbe l'editor **e** creerebbe subito una casella nuova.

Il difetto è che viene armato **senza guardare dove sia andato il fuoco**. Se il blur non
è stato causato da un click sull'SVG, non arriva nessun click a consumarlo e il flag resta
armato a tempo indeterminato, in attesa di mangiarsi il primo click legittimo.

In breve: è un flag pensato per vivere fra due eventi consecutivi, ma niente lo fa
scadere insieme al gesto che l'ha armato.

## Direzioni per la correzione

Il criterio è quello: **la soppressione deve scadere con il gesto che l'ha richiesta.**

- Legare la soppressione al gesto invece che al blur: registrare sul `mousedown` dell'SVG
  se l'editor era aperto in quel momento, e far saltare il click solo in quel caso. È
  preciso e si esaurisce da solo.
- In alternativa, far scadere il flag (timestamp invece di booleano, o un disarmo al tick
  successivo). Funziona, ma introduce una soglia temporale arbitraria.

`event.relatedTarget` del blur **non** aiuta: l'SVG non è focalizzabile, quindi arriva
`null` sia quando il fuoco va lì sia quando va fuori pagina.

## Test

Non è ancora dimostrato da un test — è dedotto leggendo. La prova è breve, in
`SvgTextEditor.test.tsx` con l'infrastruttura già presente:

```tsx
const { svg, boxes } = renderHarness([box]);
openEditorOn(svg.querySelector('text')!);
fireEvent.blur(screen.getByRole('textbox')); // il fuoco se ne va, non sull'SVG
fireEvent.click(svg, { clientX: 100, clientY: 100 });
expect(boxes()).toEqual([box, { ...nuovaCasella }]); // oggi la nuova casella non c'è
```

Scriverlo **prima** di aprire la correzione: se la deduzione è sbagliata, questa card si
chiude senza toccare niente.
