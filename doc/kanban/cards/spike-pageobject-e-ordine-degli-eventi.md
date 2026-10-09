# Spike: il PageObject di `CardFaceEditor` e l'ordine degli eventi

Che i test usino le pagine attraverso un PageObject è deciso: è nei principi di scrittura
del codice (`~/.claude/coding-principles.md`), con i metodi che dicono il gesto e non
l'effetto. Resta aperto il caso ostile, `CardFaceEditor`: metà dei suoi test esistono per
fissare l'**ordine degli eventi**, ed è proprio quello che un metodo rischia di nascondere.

## Il primo uso: l'Intro

Ottobre 2026: `IntroPage` in `src/views/IntroView/IntroView.page.ts`, con due
sotto-oggetti, l'hero e "How it works" (`introPage.heroBanner`,
`introPage.howItWorksSection`). La forma viene dagli e2e di coffeebreak
(`e2e/pages/*.page.ts`), con una differenza: i locator di Playwright sono lazy, le query di
Testing Library no, quindi qui sono getter. L'hero si trova con un `data-testid`, perché
nessun ruolo accessibile lo distingue: il page object non risale il DOM. Ha tolto lo `[0]`
con cui `App.test.tsx` sceglieva la CTA dell'hero.

## Il caso di `CardFaceEditor`

In `CardFaceEditor.test.tsx` c'è già un abbozzo di PageObject, cresciuto per necessità e
mai chiamato così: `renderHarness`, `renderEditor`, `openEditorOn`. Nascondono il gesto e
restituiscono un modo per interrogare lo stato.

A favore:

- **I test parlano la lingua del browser, non del biglietto.** Un `mouseDown` con delle
  coordinate seguito da un `mouseUp` sulla finestra significa "apri l'editor su questa
  casella". Lo dice già `openEditorOn`, ma per un caso solo.
- **Le query sono legate alla grafica.** `getByRole('button', { name: '×' })` si rompe il
  giorno che la × diventa un'icona. Un metodo in un posto solo assorbe il colpo.
- Toglierebbe da solo una parte dei commenti: vedi
  [Potare i commenti nei test](potare-i-commenti-nei-test.md).

Il rischio: mousedown → blur → click, il `preventDefault` sul mousedown dei bottoni. Un
metodo che impacchetta la sequenza nasconde la cosa che il test deve dimostrare.

## Come rispondere

Indagine a tempo, non un rifacimento. Prendere **due** test di `CardFaceEditor.test.tsx`,
uno sul ciclo di vita delle caselle e uno sulla chiusura per blur, riscriverli con un
PageObject e metterli accanto agli originali. Poi guardare la coppia e decidere.

Le risposte possibili, per i test sull'ordine:

- restano scritti a mano, e il PageObject serve solo agli altri;
- il PageObject espone i gesti uno per uno (premere, rilasciare, uscire dal campo), così la
  sequenza resta scritta nel test;
- il PageObject li impacchetta comunque, se il test resta leggibile.

Criterio: il test riscritto deve restare **leggibile senza aprire il PageObject**, e deve
far vedere l'ordine degli eventi dove è quello il punto.

Esito atteso: una risposta scritta qui e, se cambia qualcosa, una riga nei principi. Non
codice.

## Card collegate

- [Scomporre `CardFaceEditor`](scomporre-cardfaceeditor.md): se il componente si spezza in
  pezzi più piccoli, ognuno testabile per conto suo, la sequenza da proteggere si riduce.
  Conviene sapere l'esito di questo spike prima di scomporre, non dopo.
- [Potare i commenti nei test](potare-i-commenti-nei-test.md): da fare dopo questo.
