---
name: kanban
description: Kanban del progetto — feature, idee, infrastruttura
user-invocable: true
---

# Kanban

Board di progetto: feature, idee, infrastruttura. Vive nella documentazione del
progetto, non dentro questa skill:

- indice della board: `doc/kanban/README.md`
- card, una per file: `doc/kanban/cards/<slug>.md`
- archivio delle card chiuse: `doc/kanban/DONE.md`

Se l'indice non esiste, crealo copiando `templates/board.md` (accanto a questo
file). In un progetto con una struttura diversa, cambia i tre percorsi qui sopra.

Le sezioni del BACKLOG, che sono anche le categorie dell'archivio:

- **Bug** — qualcosa si comporta male e va corretto.
- **Refactoring** — cambiare la struttura senza cambiare il comportamento.
- **Feature** — funzionalità nuova, di quelle che si vedono da fuori.
- **Tech** — lavoro sul codice che non è né un bug né una funzionalità: test, build, tooling, infrastruttura, aggiornamenti di versione.
- **Operations** — attività da svolgere a mano, **senza scrivere codice**: aggiornare un foglio di calcolo, assegnare permessi a un ruolo, travasare dati, eseguire una procedura. Se per chiuderla si apre l'editor, non è questa: quasi sempre è Tech.
- **Spike** — un'indagine a tempo, che produce una risposta e non del codice.

Regole d'uso:

- Per presentare la board o rispondere a "che abbiamo in programma?" basta l'indice: non leggere i file delle card.
- Leggi il file di una card solo quando ci si lavora o l'utente chiede dettagli su di essa.
- Nuova card: crea `cards/<slug>.md` (titolo `#` + corpo, nessuna struttura obbligata: ogni card ha le sezioni che le servono) e aggiungi la riga nella sezione giusta dell'indice.
- Decisioni, note e follow-up di lavorazione vanno nel file della card, non nell'indice.
- Card completata: sposta la riga in DONE. Ogni tanto, **su richiesta dell'utente**, le card DONE vanno archiviate: sposta il corpo in `doc/kanban/DONE.md` sotto la sezione giusta (le stesse del BACKLOG) mantenendo lo stile delle voci esistenti, poi elimina file e riga. Non farlo di iniziativa.

Quando l'utente invoca `/kanban`, leggi l'indice, presenta la board e chiedi cosa vuole affrontare.
