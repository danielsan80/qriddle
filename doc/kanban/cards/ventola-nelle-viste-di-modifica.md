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

1. **Lo sfondo delle facciate su un livello a sé** — fatto. Scartata l'alternativa di
   estrarre il JPEG da `outer.svg`: avrebbe tolto la decodifica ma non la
   rasterizzazione del disegno vettoriale, e chiedeva di adeguare
   `tools/generate-parchment.py`. `CardFaceEditor` disegna i children in un `<svg>` sotto
   quello delle caselle, che ha `will-change: transform`: trascinando si ridipinge solo
   lui (Paint flashing lo conferma).
2. **L'URL scritto al rilascio del trascinamento** — fatto. Durante il gesto la posizione
   resta nello stato locale di `CardFaceEditor`, che la comunica una volta sola al
   rilascio: una scrittura dell'URL per trascinamento invece di una per frame. Scartato il
   debounce nel context: avrebbe chiesto di forzare la scrittura alla chiusura della
   scheda, e la digitazione non arriva al throttling di Chrome. Corregge anche la perdita
   descritta nella seconda misura. Uno smontaggio a metà trascinamento perde lo
   spostamento: accettato, non c'è un modo normale di cambiare facciata col mouse
   premuto.
3. **Il QR dei crediti generato una volta sola**, invece che a ogni ingresso sul retro.
   Guadagno piccolo (16 ms per ingresso), costo piccolo.

Fuori da qui: il ricalcolo della mappa al montaggio non è emerso come costo, e resta
com'è.

## Seconda misura (2026-10-08, pomeriggio)

Dopo il passo 1 il browser vero decodificava ancora: 4,3 s di Image decode in 21 s di
trascinamento, sul server di sviluppo. Selezionando un blocco, la riga Network mostrava
una richiesta di `favicon.png` a ogni frame.

- **La favicon era un PNG 1024×1024 da 2,1 MB.** A ogni `replaceState` cambia l'URL e
  Chrome rilegge e ridecodifica la favicon della scheda, circa 14 ms ogni volta; il
  server di sviluppo la serve senza cache. Ridotta a 48×48 (4 kB), difesa da
  `src/favicon.test.ts`. Dopo: nessuna Image decode, frame fissi a 16,7 ms. Parte dei
  917 ms della prima misura era probabilmente questa, non lo sfondo.
- **Chrome rallenta le `replaceState` troppo frequenti** ("Throttling navigation to
  prevent the browser from hanging", su `urlState.ts`). Se scarta l'ultima scrittura,
  l'URL resta con una posizione vecchia della casella: lavoro perso in silenzio. Il passo
  2 quindi corregge anche questo.
- DevTools attribuiva le decodifiche a un `div` della barra laterale (_Owner element_):
  attribuzione sbagliata, da non seguire.

## Fitness function

`npm run fitness` (Playwright, `fitness/`) fa la build, trascina una casella in Chromium
headless e conta gli `ImageDecodeTask` nella traccia: al massimo uno. Sul codice prima del
passo 1 erano 58. Gira nel workflow prima del deploy.

Non vede la favicon: headless non ha schede e non la carica. Per quella c'è il test sulle
dimensioni; il resto si verifica a mano con una registrazione nel browser vero.
