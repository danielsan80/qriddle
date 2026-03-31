---
name: kanban
description: Kanban del progetto — feature, idee, infrastruttura
user-invocable: true
---

# Kanban

Board di progetto: feature, idee, infrastruttura.
Quando l'utente invoca `/kanban`, presenta la board e chiedi cosa vuole affrontare.

## BACKLOG

### Feature

#### Multipuzzle: QR diviso in 4 settori

Dividere il QR code in 4 quadranti e generare un puzzle indipendente per ciascuno. Ogni quadrante può usare uno stile diverso (es. paint-by-area, labirinto, ecc.).

#### Stili puzzle alternativi

Oltre al paint-by-area già implementato, esplorare altri stili: labirinto puro, numeri nelle aree, schema a colori, ecc. Da scegliere per ogni quadrante nel multipuzzle.

#### Rivedere il tipo `Face` in `CardFaceNav`

Sostituire il tipo stringa con punto (`'inner.map'`, `'outer.front'`…) con un union type strutturato, es. `{ page: 'inner' | 'outer'; face: 'map' | 'front' | 'back' | 'center' }`.

#### [Spike] Download SVG modificabile

Capire se ha senso e se è fattibile esportare il biglietto come SVG (oltre che PDF), in modo da poterlo aprire e modificare con Inkscape o simili. Valutare: il puzzle generato dinamicamente è rappresentabile in SVG? il testo dei campi della wizard si integra bene? Vedi anche la skill `svg-rendering` per opzioni tecniche già analizzate.

### Infrastruttura

#### Linkare il progetto dalla GitHub Pages principale (sezione "Lab")

Aggiungere link al progetto qriddle nella pagina GitHub Pages personale, sezione "Lab".

## DOING

## DONE

### Anteprima animata del biglietto

Convertita in `CardFaceNav`: navigazione visuale interattiva delle 4 facciate del biglietto (mappa, fronte, centro, retro) con diagramma schematico cliccabile.

### SVG outer (4 facciate A6)

### Refactor Canvas e Panel

Separazione in componenti: `CanvasStage`, `QrcodeCanvas`, `PreviewCanvas`, `Panel`. Aggiunto `CardFaceNav` per navigare le sezioni del PDF.

### Riorganizzare i file .ts in cartelle semantiche

### Rivedere l'interfaccia UI

### Mostrare il seed in interfaccia (token alfanumerico 10 caratteri)

### Aggiungere pulsante per rigenerare il seed casualmente

### Rendere il seed modificabile manualmente

### Download PDF del puzzle da stampare

### Creare repo GitHub pubblico

### CI/CD con GitHub Actions per deploy su GitHub Pages

### Centralizzare la gestione dei parametri di configurazione

### Riorganizzare src/lib con macro-cartelle di contesto (domain, render, config, util)

### Wizard biglietto di auguri

PDF 2 pagine A4 (fronte/retro da stampare su un unico foglio):

- **inner** (già implementato): pagina interna — aperta completamente mostra l'A4 intero col puzzle
- **outer** (da fare): pagina esterna — 4 facciate A6 disposte per la stampa:
  - `[ retro | fronte ]` — visibili a biglietto chiuso
  - `[ centro-sx | centro-dx ]` — visibili aprendo a metà; la grafica invita ad aprire completamente

Campi per facciata:

- **fronte**: destinatario, titolo (es. "Buon compleanno Pinco")
- **centro-sx**: data, dedica, mittente
- **centro-dx**: testo libero / messaggio aggiuntivo
- **retro**: credits, QR code piccolo

La wizard guida step per step (seed → fronte → centro → retro → QR/puzzle). Si naviga avanti/indietro. Il PDF è sempre scaricabile.

### Credits e QR nella back view

Nella facciata retro del biglietto, aggiungere automaticamente (non editabile dall'utente):

- testo credits (es. "Creato con QRiddle")
- QR code che punta all'URL del tool

### Aggiungere og:image per anteprima social

Scattare una foto del biglietto stampato (puzzle visibile) e aggiungerla al repository come immagine Open Graph (1200×630px). Aggiornare `index.html` con il tag `og:image` e `twitter:image`.

### Esperienza mobile: blocco + redirect al desktop

Overlay fullscreen su dispositivi touch (`navigator.maxTouchPoints > 0`). Messaggio chiaro per utenti non-dev con pulsante "Share the link" (Web Share API → share sheet nativo, visibile solo se disponibile) e "Copy the link" (clipboard fallback con feedback "Link copied!").
