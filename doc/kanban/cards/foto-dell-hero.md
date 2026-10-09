# Una foto dell'hero da un'altra angolazione

L'hero dell'Intro mostra il puzzle mentre si risolve, con il QR che emerge: è la stessa
foto dell'ultimo passo di "How it works" (`src/assets/photos/solve_puzzle.webp`), e la
ripetizione a una schermata di distanza stona. Era provvisoria dalla
[revisione dell'Intro](revisione-comunicazione-intro.md).

Serve uno scatto nuovo dello stesso momento, il QR che emerge sotto il pennarello, da
un'altra angolazione. Poi si sostituisce l'import in `IntroView`, con un `alt` che lo
descriva.

Sotto i 720px la foto diventa una striscia sopra il testo, ritagliata al centro in
proporzione 4:1: conviene che il QR che emerge stia nel mezzo dello scatto.

## Lo scatto e il trattamento

9 ottobre 2026: scattata dal basso e di lato, la mano con il pennarello sul QR che emerge;
la striscia 4:1 al centro tiene i due quadrati, il labirinto e la punta della penna.

Il trattamento in GIMP, in quest'ordine:

1. `Colori → Temperatura colore`: da 6500 a 7500 K.
2. `Colori → Livelli`, livelli di ingresso: bianco da 255 a circa 228, dove finisce
   l'istogramma. La carta passa da circa 210 a 230 senza bruciarsi.
3. `Colori → Tonalità-Saturazione`: saturazione +20, luminosità +15.
4. `Colori → Livelli`, livelli di ingresso: nero da 0 a 20, per riportare i quadrati del
   QR al nero che la luminosità aveva alzato.

Le altre foto di "How it works" non hanno filtri: il confronto con un originale del
fronte (29 marzo, 22:43) dà gli stessi colori su legno, carta e inchiostro. Le differenze
fra loro vengono dalla luce: la sera con la lampada, più arancione; `solve_puzzle` di
giorno, più chiara e neutra.

## Fatto

`src/assets/photos/solve_puzzle_side.webp`: ritagliata in 3:2 come le altre, togliendo
soprattutto il muro in alto, 1319×879 (l'originale non arriva ai 1600 delle altre, e
l'hero è largo circa 500 px), WebP qualità 82, 131 KB. Nell'hero con `width` e `height`.
