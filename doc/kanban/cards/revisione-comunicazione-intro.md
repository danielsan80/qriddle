# Revisione della comunicazione della prima vista (Intro)

La prima schermata deve far capire in 3–5 secondi cosa fa l'app, e portare a cominciare.
Oggi apre con "How it works" e quattro foto con didascalia: chiede di guardare e
interpretare prima di sapere di cosa si parla. Il payoff, "Put a treasure into your
greeting card", è evocativo ma non dice cosa succede: un regalo, un messaggio, un gioco?

I dati di Umami di inizio ottobre vanno nella stessa direzione: nessun visitatore, a parte
me, è andato oltre l'Intro (card
[Un evento Umami a ogni cambio di passo](evento-umami-per-passo.md)).

## La proposta

Nata in una conversazione con ChatGPT, che però qriddle non l'aveva visto in uso: le
correzioni sotto vengono da lì.

- **Titolo grande**: "Turn your greeting card into a puzzle".
- **Sottotitolo letterale**, non creativo, che dica il come. Da scegliere fra:
  - "Write a secret message. Print it as a puzzle. They solve it to read it.";
  - la frase della meta description di `index.html`, che già funziona: "Your text becomes a
    printable QR code puzzle the recipient must solve to reveal it."
- **CTA principale** che dice l'azione, non "Next": "Create your puzzle". Secondaria,
  facoltativa: "Try an example", che apre uno degli esempi già in `MapView/examples.ts`.
- **"How it works"** resta, con le foto, sotto titolo e CTA, come supporto.
- **La navigazione per passi**: nell'Intro forse va nascosta, perché un percorso a tappe
  visibile fa percepire fatica. È un'opinione: si prova e si misura.

## Idee più vecchie, dalla skill `wizard-ux`

Di marzo 2026, mai fatte; la skill è stata tolta l'8 ottobre 2026.

- **Un'animazione di apertura del biglietto** (fronte → centro → mappa) come onboarding:
  mostrata una volta al primo accesso e richiamabile con un bottone, mai come transizione
  fra i passi. Le quattro foto di "How it works" raccontano già la stessa sequenza.
- **Il download sempre visibile**, fuori dal wizard e non condizionato al completamento dei
  passi. Oggi è l'ultimo passo.

## Correzioni alla proposta originale

- **Niente "riddle".** "Create a QR code riddle" fa pensare a un indovinello con una
  risposta; chi riceve risolve invece un rompicapo logico su carta, la cui soluzione
  disegna un QR con il messaggio. La parola crea proprio l'ambiguità che si vuole togliere.
- **Si stampa, non si condivide.** "Share a QR code" è sbagliato: il biglietto è un oggetto
  di carta, ed è ciò che distingue qriddle. La proposta non lo diceva mai.
- **Dopo la CTA nessuna schermata vuota**: già così. La mappa parte con un testo di default e
  un puzzle generato.

## Come si misura

- **Prima e dopo**, il test dei 5 secondi: mostrare la pagina a qualcuno che non la conosce e
  chiedere "cosa fa questo sito?". Funziona se risponde qualcosa come "metti un messaggio
  segreto in un biglietto, come rompicapo da risolvere".
- **Il click sulla CTA** è il passaggio da Intro a Map: serve l'evento per passo, quindi
  quella card va fatta prima di questa.
