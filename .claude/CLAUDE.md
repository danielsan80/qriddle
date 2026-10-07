# Regole progetto

- Dopo `npm run dev`, fornisci solo il link (http://localhost:5173). Non verificare l'output del server.
- Usa CSS Modules con nesting nativo per i componenti React.
- Dopo modifiche, esegui `npm run check` (lint + format + test).

## Kanban

Board in `doc/kanban/README.md`, card in `doc/kanban/cards/`, archivio in
`doc/kanban/DONE.md`. Regole d'uso nella skill `/kanban`.

## Dominio

Il codice sta in `src/lib/domain/`: lì nomi e firme. Qui il lessico con cui ne parliamo.

- **immagine** (`Image`): la griglia di pixel bianchi e neri da cui nasce il puzzle, il QR
  con ogni modulo raddoppiato;
- **cella** o pixel (`Pixel`): una casella della griglia, con posizione (`Coord`) e colore;
- **area** (`Area`): celle dello stesso colore adiacenti ortogonalmente;
- **bordo** (`Edge`): il confine fra due celle adiacenti, esterno se sta sul margine della
  griglia; può avere un **muro**;
- **blocco 2x2**: quattro celle a quadrato senza muri fra loro, vietato nel puzzle finito;
- **puzzle** (`Puzzle`): l'immagine con i muri, in cui ogni area è percorribile da ogni sua
  cella a ogni altra e senza blocchi 2x2; più un **punto** (`dots`) in una cella a caso di
  ogni area nera. Lo genera un **seed**, quindi lo stesso seed dà lo stesso puzzle;
- **facciata** (`Face`): fronte, centro o retro, le facciate esterne del biglietto su cui si
  scrive; la mappa sta nella pagina interna;
- **casella di testo** (`TextBox`, `FacedTextBox`): una scritta su una facciata.

Il problema e l'algoritmo di generazione: [doc/generazione-del-puzzle.md](../doc/generazione-del-puzzle.md).
