# La ventola parte nelle viste di modifica

Segnalato il 2026-10-07 su `qriddle.app`: modificando le facciate e andando avanti e
indietro fra i passi, la ventola del pc comincia a lavorare forte.

## Ipotesi di partenza

Leggendo il codice non c'era niente che girasse in continuo (cicli, animazioni infinite,
timer ripetuti). C'erano lavori pesanti ma puntuali, che scattano proprio con quei gesti:

1. tornare alla mappa la ricalcola da zero: `MapView` al montaggio rigenera QR e puzzle e
   ridisegna l'anteprima della pagina interna;
2. ogni facciata disegna per intero `outer.svg` (200 KB, con un JPEG incorporato) e ne
   mostra un quarto;
3. trascinare una casella scrive l'URL a ogni movimento del mouse: compressione LZ più
   `replaceState`.

## Come si è misurato (2026-10-08)

- `top` della macchina, con due campioni (`top -b -d1 -n2 -o %CPU`): con uno solo le
  percentuali restano a zero;
- task manager di Chrome (Shift+Esc), per la CPU della singola scheda;
- DevTools → Performance su `qriddle.app`, con Screenshots disattivato (genera lavoro da
  solo) e l'intervallo selezionato per intero prima di leggere Summary e Bottom-up. La
  seconda serie in incognito, per togliere le estensioni.

## Esito

**A riposo.** La scheda di qriddle sull'Intro consuma pochissimo: 1,5 ms di JavaScript in
5,7 s. La ventola che girava a scheda chiusa veniva da altro: un processo `chrome` al 43%,
con 32 minuti di CPU accumulati in due ore, probabilmente un'estensione o un'altra scheda;
in più WebStorm che indicizzava.

**Navigazione fra i passi** (22 s, una dozzina di cambi, in incognito). Thread principale
al 4,5%, di cui qriddle 176 ms: circa 14 ms per cambio di passo. Le voci di qriddle:

- Image decode 164 ms: il JPEG dentro `outer.svg`, decodificato di nuovo a ogni facciata;
- `toDataURL` 16 ms: il QR dei crediti, rigenerato a ogni ingresso sul retro.

Con le estensioni attive, uno script di estensione (`content.js`, su `pointerover`) costava
più di qriddle: 319 ms contro 141. Il lavoro sotto `pointermove` (circa 200 ms) è di React
e degli stili `:hover`: qriddle non ascolta quell'evento.

**Trascinamento di una casella** (23,5 s continui, in incognito). Thread principale al
29%, riga GPU piena: è il caso che scalda.

- **Image decode 917 ms (23%).** `outer.svg` sta in un `<image>` dentro l'SVG della
  facciata: a ogni ridisegno il browser lo rasterizza di nuovo e ridecodifica il JPEG che
  contiene. Durante il trascinamento si ridisegna a ogni frame;
- **Umami: 13 s di rete occupata, 695 kB inviati**, `fetch` 339 ms, il suo script 396 ms.
  Lo script intercetta `replaceState` e, senza `data-exclude-hash`, considera l'hash
  parte dell'URL: ogni scrittura dello stato diventava una pagina vista;
- **compressione LZ** (`_compress`) 270 ms, più `replaceState` e `setAttribute`: l'URL
  riscritto a ogni movimento del mouse.

## Considerazioni

- **Umami era un problema di privacy prima che di prestazioni.** L'hash contiene il lavoro,
  compreso il testo segreto del QR, e finiva su un servizio di terzi a ogni modifica. Le
  statistiche erano gonfiate: le "pagine viste" erano in gran parte modifiche. Corretto il
  2026-10-08 con `data-exclude-hash="true"`, difeso da `src/indexHtml.test.ts`. Si perde il
  conteggio dei cambi di passo come pagine, che però non era affidabile; il download resta
  tracciato con il suo evento. I dati già raccolti contengono gli hash: valutare il reset
  del sito in Umami. Che Umami rispetti l'attributo si verifica a mano una volta, dopo il
  deploy (Network, filtro `umami`, trascinare una casella: nessuna richiesta): è
  comportamento della libreria, e testarlo vorrebbe una sua copia locale che diverge da
  quella servita.
- **La navigazione non va ottimizzata per la ventola**: 14 ms per passo sono poco. Le due
  voci che spiccano (decode e QR) si sistemano comunque con i passi qui sotto.
- **Il carico vero è il trascinamento**, e viene da due fonti indipendenti: il ridisegno
  dello sfondo e la scrittura dell'URL. Vanno corrette entrambe, misurando dopo ciascuna.
- **Le estensioni del browser pesano** più di qriddle nella navigazione: le misure si
  rifanno in incognito, altrimenti si inseguono costi che non sono nostri.

## Passi di miglioramento

In ordine di guadagno atteso. Dopo ciascuno, la stessa registrazione del trascinamento in
incognito, confrontata con quella di oggi.

1. **Lo sfondo delle facciate senza SVG annidato.** Estrarre il JPEG da `outer.svg` in un
   file a parte (o disegnarlo con un `<image>` che punta direttamente al JPEG), così il
   browser lo tiene in cache già decodificato. `tools/generate-parchment.py` oggi riscrive
   il base64 dentro `inner.svg` e `outer.svg`: va adeguato perché non diverga. Atteso: le
   decodifiche spariscono da 917 ms a quasi zero.
2. **L'URL scritto al rilascio del trascinamento**, non a ogni movimento. Il context tiene
   già lo stato in memoria; la scrittura può aspettare la fine del gesto (o un debounce,
   che coprirebbe anche la digitazione). Atteso: via i 270 ms di compressione e le
   scritture ripetute.
3. **Il QR dei crediti generato una volta sola**, invece che a ogni ingresso sul retro.
   Guadagno piccolo (16 ms per ingresso), costo piccolo.

Fuori da qui: il ricalcolo della mappa al montaggio non è emerso come costo, e resta
com'è.
