---
name: wizard-ux
description: Decisioni UX per la wizard del biglietto di auguri
user-invocable: false
---

# Wizard UX — Biglietto di auguri

## Struttura del biglietto

PDF 2 pagine A4 (fronte/retro da stampare):

- **outer**: pagina esterna — 4 facciate A6 disposte per la stampa
- **inner**: pagina interna — aperta completamente mostra l'A4 col puzzle

Layout outer quando srotolato:

```
[ retro | fronte ]   ← visibili a biglietto chiuso
[ c.sx  | c.dx  ]   ← visibili aprendo a metà
```

## Navigazione: diagramma spaziale (preferito)

Invece di una wizard lineare prev/next, mostrare un **diagramma persistente del biglietto** con le 4 facciate cliccabili. Cliccando una facciata si seleziona per l'editing.

Vantaggi:

- Rispecchia la struttura spaziale del biglietto (non è un flusso sequenziale)
- Non impone un ordine di compilazione
- Sempre visibile → orienta l'utente

Il diagramma mostra visivamente quale facciata è selezionata (evidenziata).

## Animazione di apertura: onboarding, non navigazione

L'animazione che simula l'apertura del biglietto (fronte → centro → puzzle) è utile per spiegare la struttura, ma non deve essere il meccanismo di navigazione principale.

Usi consigliati:

- Mostrata **una volta sola** al primo accesso come onboarding
- Richiamabile on demand con un bottone "anteprima apertura"
- **Non** usarla come transizione ad ogni cambio di facciata (diventa noiosa)

## Step centro-sx e centro-dx

Aprendo il biglietto a metà le due facciate centrali sono visibili insieme.
→ Editarle in un **unico step** con anteprima che le mostra affiancate.

## Seed

Il seed è un dettaglio tecnico, non va come primo step.

Opzioni:

- Collocarlo nello step del puzzle, dove ha senso contestuale
- Oppure in un pannello "impostazioni avanzate" collassabile, accessibile da qualsiasi step

## PDF sempre scaricabile

Il pulsante di download del PDF deve essere **fuori dalla wizard**, sempre visibile, non condizionato al completamento degli step.

## Campi per facciata

- **fronte**: destinatario, titolo (es. "Buon compleanno Pinco")
- **centro-sx**: data, dedica, mittente ("da Pallino")
- **centro-dx**: testo libero / messaggio aggiuntivo
- **retro**: credits, testo libero
- **inner (puzzle)**: contenuto QR code, seed, stile puzzle
