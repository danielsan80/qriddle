# Potare i commenti nei test dell'editor

Regola aggiunta a `.claude/CLAUDE.md` il 2026-09-03: se un commento spiega **cosa** fa il
codice, va riscritto il codice e tolto il commento, anche a costo di più righe. Restano
solo i **perché** che non si deducono leggendo.

`CardFaceEditor.test.tsx` è scritto contro quella regola, e il conto lo dice senza bisogno
di discutere:

| file                      | righe di commento |
| ------------------------- | ----------------- |
| `CardFaceEditor.test.tsx` | 45                |
| altri 18 file di test     | 5 in tutto        |

Non è lo stile del progetto: è un file fuori scala. La causa è che quei test sono nati da
una lettura guidata del componente, e la spiegazione è finita **accanto** al codice invece
che **dentro**.

## Cosa tenere

I commenti che registrano un vincolo esterno o una decisione, cioè quelli che nessuna
riscrittura può esprimere:

- perché lo stub della CTM usa scala **2 e non 1** — con 1 la divisione per la scala
  sparirebbe senza far fallire niente;
- cosa jsdom **non** fa (geometria SVG, layout, spostamento del focus), che è la ragione per
  cui metà dei test sono scritti in modo strano;
- che il test sul blur dimostra come l'editor gestisce la sequenza, **non** che il browser
  la produca in quell'ordine;
- che Enter ed Escape sono fissati insieme di proposito, così un domani "Escape annulla"
  è una scelta e non uno scivolone —
  [Escape non annulla la modifica](escape-non-annulla-la-modifica.md).

## Cosa togliere

La cronaca: le righe che raccontano il gesto che la riga sotto sta già facendo. Vanno via
per riscrittura, non per cancellazione — se resta un buco di comprensione, il commento
serviva.

Due esempi di come si eliminano da soli:

- il commento su "chiudo con Enter la casella vuota e sparisce" è sparito sostituendo il
  gesto con il click sulla **×**: il codice dice già cosa succede;
- `fireEvent.mouseDown(text, { clientX: 100, clientY: 100 })` seguito da
  `// |dx| + |dy| === 5: uno oltre la soglia` chiede al lettore di fare la sottrazione a
  mano. Una funzione che prende lo spostamento invece delle coordinate assolute toglie il
  commento e il calcolo.

## Attenzione

Alcuni di questi commenti sono l'unico posto dove è scritto qualcosa che è costato una
sessione di lettura. Se un "perché" non trova casa nel codice, **prima** va spostato sulla
card [Debito di revisione dell'editor SVG](debito-di-revisione-editor-svg.md), poi si
cancella. Potare non deve diventare buttare.

## Card collegate

Da fare dopo lo [Spike sul PageObject](spike-pageobject-nei-test.md): se si adotta, una
parte della potatura la fa da sola dando un nome alle cose, e potare prima significherebbe
rifare il lavoro.
