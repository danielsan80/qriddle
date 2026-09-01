# Il prototipo

[`qr-puzzle-generator.html`](qr-puzzle-generator.html) è da dove è partito tutto:
una pagina sola, il 1 gennaio 2026, il giorno dopo il primo commit del repo. Si
apre nel browser senza build — non ha dipendenze locali, tira giù `qrcode.js`
da un CDN e i font da Google Fonts.

Non è mantenuto e non fa parte dell'applicazione: sta qui perché è il punto di
partenza dell'algoritmo, e leggerlo accanto a `src/lib/domain/puzzle/` fa vedere
cosa è cambiato.

Sta qui anche perché non ha mai funzionato. È nato chiedendo il puzzle a parole,
descrivendo il risultato che volevo, e continuando a ridescriverlo mentre i
labirinti uscivano sbagliati. A un certo punto ho smesso di riformulare la
richiesta e ho aperto il cofano: qual è davvero il problema, e che nome ha in
letteratura. Da lì sono venuti il modello di dominio (`Coord`, `Area`, `Edge`),
lo spanning tree come garanzia invece che come speranza, e i test. Il prototipo
è la misura di quella differenza.

## Cosa è rimasto

L'ossatura. Codifica del messaggio in QR, raggruppamento delle celle in aree
monocromatiche, muri fissi sul confine di ogni area, e dentro l'area uno
spanning tree che garantisce che ogni cella sia raggiungibile da ogni altra.

## Cosa è cambiato

Il prototipo non si fermava all'albero: sugli archi rimasti fuori murava con
probabilità 0,7, così un 30% restava aperto e produceva anelli
(`addSerpentineWalls`). Gli anelli servivano a rendere il percorso meno
prevedibile, ma aprono la porta ai blocchi 2×2 — quattro celle senza muri in
mezzo, che sulla carta stampata diventano una macchia invece di un corridoio.
Il guardiano contro quel caso c'era, `has2x2BlockNearEdge`, e non ha mai
funzionato: viene chiamato subito dopo aver messo un muro, ma i due blocchi 2×2
che esamina contengono entrambi proprio quel muro, quindi li trova sempre
sbarrati e non annulla mai niente. Provato: 20.957 chiamate su un'area 6×6
aperta, zero annullamenti.

La versione attuale rinuncia agli anelli e ottiene i corridoi lunghi altrove:
una visita in profondità con un bias verso il proseguire dritto
(`biasStraight`). Un albero non ha cicli, quindi i blocchi 2×2 non possono
nascere e non c'è niente da controllare a posteriori — il guardiano non serve
più, ed è per questo che nessuno si era accorto che non funzionava.

Il resto della differenza è struttura: qui è tutto in funzioni che si passano
array di array, mentre in `src/lib/domain` ci sono value object (`Coord`,
`Edge`, `Area`) e la suite di test che il prototipo non aveva.
