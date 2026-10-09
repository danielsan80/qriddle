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

- **Titolo grande**: "Turn your greeting card into a puzzle". Superato, vedi sotto le
  decisioni.
- **Sottotitolo letterale**, non creativo, che dica il come: "Write a secret message. Print
  it as a puzzle. They solve it to read it." Tre tempi, chi scrive, la carta, chi riceve.
  Scartata la frase della meta
  description ("Your text becomes a printable QR code puzzle the recipient must solve to
  reveal it."): nasconde la carta in un aggettivo, e "QR code" fa pensare a qualcosa da
  scansionare subito, mentre il QR si ottiene solo risolvendo. Nella meta description resta,
  perché lì serve alla ricerca.
- **Una CTA sola**, che dice l'azione, non "Next": "Create your puzzle", verso la mappa.
- **"How it works"** resta, con le foto, sotto titolo e CTA, come supporto.
- **La navigazione per passi**: nell'Intro forse va nascosta, perché un percorso a tappe
  visibile fa percepire fatica.

## Decisioni

- **Un hero a tutta pagina, senza sidebar.** L'Intro presenta, l'app comincia dalla mappa:
  il cambio di layout è il segnale che si entra. Spariscono quindi anche TrackNav,
  CardFaceNav, Save e Previous/Next, che sull'Intro non hanno niente da fare.
- **Il payoff resta**, "Put a treasure into your greeting card": il suo difetto era dover
  spiegare da solo, e ora sotto c'è la frase letterale. Il titolo della proposta non serve.
- **Struttura**:

  ```
  header (hero)
    hgroup
      h1  QRiddle
      p   Put a treasure into your greeting card
      p   Write a secret message. Print it as a puzzle. They solve it to read it.
    button  Create your puzzle
    button  How it works ↓, che scorre alla sezione sotto
    img     una foto del puzzle risolto
  section#how-it-works
    h2  How it works
    le 4 foto
    button  Create your puzzle
  ```

  Payoff e frase sono `p` dentro `hgroup`, non `h2` e `h3`: i livelli di intestazione
  descrivono la struttura, e non aprono sezioni. La frase che spiega è la più piccola
  della gerarchia, ma va tenuta ben leggibile: è quella che risponde al test dei 5 secondi.

- **"How it works" come seconda azione, che scorre alla sezione.** A differenza di "Try an
  example", offre una scelta vera: cominciare o prima capire. Uno scorrimento e non una
  vista nuova: basta la stessa pagina, senza un passo del wizard in più con la sua
  navigazione. Non un'ancora `href="#how-it-works"`, però: l'hash tiene il lavoro, e
  l'ancora lo sostituirebbe, cancellandolo a chi torna sull'Intro. È un bottone con
  l'aspetto di un link, che chiama `scrollIntoView`. Pesa
  meno della CTA, come link o bottone secondario, perché le due azioni non sembrino
  equivalenti. In fondo alla sezione torna "Create your puzzle", per chi ha finito di
  leggere.
- **La foto accanto al testo, non sotto.** È quella in cui il QR emerge mentre si risolve:
  al centro, dove un testo sovrapposto (con il velo per leggerlo) la coprirebbe. E come
  `<img>` con `alt` porta informazione, mentre uno sfondo CSS è decorativo. Per ora è la
  stessa foto dell'ultimo passo di "How it works", e la ripetizione stona: è provvisoria,
  finché non ce n'è una da un'altra angolazione.
- **Sul telefono l'Intro si vede.** Oggi `MobileBlock` copre tutto, Intro compresa: chi
  arriva dal telefono legge solo "This service works on desktop only", senza sapere di
  cosa si tratta. Può spiegare una parte del "nessuno va oltre l'Intro": la scheda dei
  dispositivi di Umami lo dice. L'Intro si vede intera, con l'hero in una colonna e la
  foto sotto il testo; al posto di "Create your puzzle", il messaggio che si crea dal
  computer e i bottoni per mandarsi il link, quelli di oggi. Il blocco resta sui passi del
  lavoro, dove l'editor sul telefono non funziona.
- **Misurare la sola navigazione non si può**, con questo traffico: il prima e dopo mescola
  navigazione, testo e CTA. Si decide a giudizio, e il funnel Intro→Map dice se la
  revisione nel complesso funziona.

## Avanzamento

- [x] L'hero senza sidebar, con `hgroup`, CTA e foto; "How it works" come `h2`.
- [ ] L'Intro sul telefono.
- [x] "How it works ↓" e la CTA ripetuta in fondo.
- [ ] La foto nuova per l'hero.

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
- **Niente "Try an example" come seconda CTA.** Il risultato lo mostrano già le foto di "How
  it works", e gli esempi (Isola delle Rose, Mario, il percorso) sono sulla mappa, a un clic
  dalla CTA principale: il secondo bottone porterebbe nello stesso posto con un altro testo,
  e chiederebbe una scelta senza una differenza da capire. Se la misura dice che ci si ferma
  sulla mappa, si lavora lì, per esempio dando più evidenza agli esempi.
- **Dopo la CTA nessuna schermata vuota**: già così. La mappa parte con un testo di default e
  un puzzle generato.

## Come si misura

- **Prima e dopo**, il test dei 5 secondi: mostrare la pagina a qualcuno che non la conosce e
  chiedere "cosa fa questo sito?". Funziona se risponde qualcosa come "metti un messaggio
  segreto in un biglietto, come rompicapo da risolvere".
- **Il click sulla CTA** è il passaggio da Intro a Map: serve l'evento per passo, quindi
  quella card va fatta prima di questa.
