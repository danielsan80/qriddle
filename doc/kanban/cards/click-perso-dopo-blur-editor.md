# Un click sull'anteprima va perso dopo aver chiuso l'editor cliccando altrove

Sintomo: si clicca sull'anteprima per creare una casella di testo e **non succede niente**.
Si clicca una seconda volta e funziona. Dimostrato, non ipotizzato: vedi in fondo.

Come riprodurlo:

1. clicca sull'anteprima, scrivi qualcosa nella casella
2. clicca su qualcosa **fuori dall'SVG** — un altro pannello, la navigazione fra le
   facciate, il tasto Tab, o anche solo passare a un'altra finestra
3. torna sull'anteprima e clicca per creare una casella nuova → il click viene ignorato
4. clicca ancora → adesso la casella nasce

## Causa

`CardFaceEditor.tsx`. Il blur dell'input chiude l'editor e arma un flag:

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

## Verificato (2026-09-03)

Non è più una deduzione. Provato con un test usa e getta, poi cancellato: **si perde
esattamente un click.** Con un solo click sull'SVG dopo il blur non nasce niente; con due,
la casella nasce al secondo.

Il metodo conta, perché il modo ovvio non dimostra niente. Non basta chiamare
`fireEvent.blur(input)`: quell'evento è identico a quello che il browser emette quando il
blur _è_ causato da un click sull'SVG, cioè il caso in cui la soppressione è corretta. Il
test esistente `closes the editor and swallows the click that caused the blur` (righe
226-248) fa già esattamente quella sequenza e ne legge il click mangiato come legittimo —
**è la stessa sequenza, ed è il punto: il codice non ha modo di distinguere i due casi.**

Per distinguerli serve spostare il fuoco davvero, su un elemento fuori dall'editor, così
che jsdom emetta un blur genuino senza che nessun click raggiunga l'SVG:

```tsx
// nell'harness, accanto all'editor:
<button type="button">altrove</button>;

// nel test:
openEditorOn(screen.getByText('ciao'));
expect(document.activeElement).toBe(screen.getByRole('textbox')); // il fuoco c'è davvero
act(() => screen.getByRole('button', { name: 'altrove' }).focus()); // blur vero
fireEvent.click(svg, { clientX: 60, clientY: 40 }); // click legittimo, va perso
```

Due trappole incontrate costruendo la prova, da ricordare a chi scrive il test definitivo:

- `element.focus()` va avvolto in `act()`, altrimenti React non scarica il render e
  l'overlay sembra ancora aperto quando invece si è già chiuso;
- l'asserzione su `document.activeElement` non è decorativa: senza, non si sta dimostrando
  che il blur è reale e si ricade nel caso indistinguibile di sopra.

Il test definitivo va scritto **al momento della correzione**, nel verso giusto: adesso
sarebbe rosso, e un test rosso in suite non è la stessa cosa di un difetto documentato.
