# Far capire che il link è il lavoro salvato

Dal feedback di chi ha provato l'app (card Trello "Feedback QRiddle", aprile 2026). Tre osservazioni, un solo fraintendimento:

- non si capisce che il link **è** lo stato dell'app;
- "bottone save?": chi prova cerca un salvataggio esplicito, perché non sa che c'è già;
- "non c'è bisogno del seed, magari un refresh": il seed, esposto come codice da
  leggere e modificare, pesa più di quanto serva a chi vuole solo un altro puzzle.

Il meccanismo c'è (skill `url-state`): manca il modo di dirlo. Un pulsante "copia il
link" o "salva" che in realtà copia l'URL risponderebbe a tutte e tre.

Il seed era stato messo in vista apposta (vedi DONE, "Mostrare il seed in
interfaccia"): toglierlo è una decisione da riprendere, non una pulizia.
