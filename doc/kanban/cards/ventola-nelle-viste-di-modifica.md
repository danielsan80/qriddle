# La ventola parte nelle viste di modifica

Segnalato il 2026-10-07 su `qriddle.app`: modificando le facciate e andando avanti e
indietro fra i passi, la ventola del pc comincia a lavorare forte.

Leggendo il codice non c'è niente che giri in continuo (cicli, animazioni infinite,
timer ripetuti). Ci sono lavori pesanti ma puntuali, che scattano proprio con quei gesti:

1. tornare alla mappa la ricalcola da zero: `MapView` al montaggio rigenera QR e puzzle e
   ridisegna l'anteprima della pagina interna;
2. ogni facciata disegna per intero `outer.svg` (200 KB, con un JPEG incorporato) e ne
   mostra un quarto;
3. trascinare una casella scrive l'URL a ogni movimento del mouse: compressione LZ più
   `replaceState`.

## Misura

Prima di ottimizzare, capire quale dei tre è, o se è altro:

- task manager di Chrome (Shift+Esc): se la CPU della scheda resta alta anche da fermi,
  c'è qualcosa che gira in continuo e che leggendo non si è visto; se sale solo durante i
  gesti, è uno dei tre;
- DevTools → Performance: qualche secondo di registrazione andando avanti e indietro, e
  vedere quale funzione si prende il tempo.

## Ottimizzazione

Da decidere dopo la misura, su quello che risulta. Il punto 3 potrebbe sparire già con
[Modificare una facciata cancella quelle successive](modifiche-perse-tornando-indietro.md),
se la scrittura nell'URL durante il trascinamento si rimanda al rilascio.
