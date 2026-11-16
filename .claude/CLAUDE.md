# Regole progetto

- Dopo `npm run dev`, fornisci solo il link (http://localhost:5173). Non verificare l'output del server.
- Usa CSS Modules con nesting nativo per i componenti React.
- Dopo modifiche, esegui `npm run check` (lint + format + test).

## Kanban

Board in `.private/kanban/`, nel repo privato `danielsan80/qriddle-private`: le
modifiche alla board si committano lì. Regole d'uso nella skill `/kanban`.

## Dominio

Il codice sta in `src/lib/domain/`: lì nomi e firme. Qui il lessico con cui ne parliamo.

- **modulo**: una casella del QR;
- **immagine** (`Image`): la griglia di pixel bianchi e neri da cui nasce il puzzle, il QR
  con ogni modulo raddoppiato in 2x2 celle;
- **cella** o pixel (`Pixel`): una casella della griglia, con posizione (`Coord`) e colore;
- **modulo preannerito** (`prefilledModules`, `prefilledCells` per le sue celle): un
  modulo nero già annerito nel puzzle; le altre aree sono le **aree da risolvere**;
- **area** (`Area`): celle adiacenti ortogonalmente, dello stesso colore e tutte
  preannerite o tutte no (`Area.kind`: `'prefilled'` o `'toSolve'`);
- **bordo** (`Edge`): il confine fra due celle adiacenti, esterno se sta sul margine della
  griglia; può avere un **muro**;
- **blocco 2x2**: quattro celle a quadrato senza muri fra loro;
- **puzzle** (`Puzzle`): l'immagine con i muri, in cui ogni area da risolvere è
  percorribile da ogni sua cella a ogni altra e senza blocchi 2x2; più un **punto** (`dots`)
  in una cella a caso di ogni area nera da risolvere. Nasce dal QR, da un **seed** e dalla
  percentuale di moduli preanneriti (`PuzzleFactory.create`): lo stesso seed dà lo stesso
  puzzle;
- **biglietto** (`domain/card`): il foglio da piegare che si stampa, con le facciate
  esterne e la pagina interna con la mappa;
- **specifica** (suffisso `Spec`): dati senza comportamento che descrivono cosa generare.
  `CardSpec` è quella del biglietto, ciò che il link salva;
- **facciata** (`Face`): fronte, centro o retro, le facciate esterne del biglietto su cui si
  scrive; la mappa sta nella pagina interna;
- **casella di testo** (`TextBox`, `FacedTextBox`): una scritta su una facciata.

Il problema e l'algoritmo di generazione: [doc/generazione-del-puzzle.md](../doc/generazione-del-puzzle.md).
