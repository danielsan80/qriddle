# L'Intro fuori dai passi

Con l'hero a tutta pagina (card
[Revisione della comunicazione della prima vista](revisione-comunicazione-intro.md))
abbiamo deciso che "l'Intro presenta, l'app comincia dalla mappa": l'Intro è una soglia,
non una tappa. Il modello però è rimasto quello di prima, e `Step` la conta ancora come il
primo passo del percorso.

## Le stonature

- **`WorkStep = Exclude<Step, 'intro'>`**, in `context/steps.ts`, lo usa `StepView`. Un
  tipo ricavato togliendo un'eccezione dice che l'eccezione è un concetto a parte.
- **`TrackNav` elenca "Intro"** come prima tappa, ma si vede solo dentro il lavoro: una
  tappa da cui si è già usciti, con un altro layout.
- **"Previous" sulla Map** porta all'Intro, come fosse il passo precedente del lavoro.
- **Il context** tiene l'Intro in `step`, e così l'hash e l'evento `step-changed`.

## La direzione

`Step` diventa il percorso del lavoro, Map → Download, e `WorkStep` sparisce. Sopra c'è un
livello che distingue l'Intro dal lavoro a un certo passo. Da evitare `step: Step | null`
con `null` per l'Intro: nasconde il concetto invece di nominarlo.

L'alternativa scartata: tenere l'Intro come passo e dare a `WorkStep` un nome che dica cosa
hanno in comune (i passi con la sidebar). Costa meno, ma lascia un percorso lineare che
comincia da un posto da cui l'app ti fa "entrare".

## Da decidere

- **Il nome e la forma del livello sopra `Step`.**
- **L'hash**: link salvati possono avere `step=intro`; la lettura deve accettarli.
- **L'evento Umami**: oggi `step-changed` con `intro` → `inner.map` misura il funnel della
  card dell'Intro. Va deciso come resta misurabile, senza rompere il confronto con i dati
  già raccolti.
- **"Intro" in `TrackNav`**: tolto, o diventa altro, per esempio il titolo che riporta
  all'inizio.
- **"Previous" sulla Map**: sparisce, o diventa un ritorno esplicito all'Intro.

## Di passaggio

In `IntroView` c'è una costante locale `STEPS`: le fasi di "How it works" con le foto. È un
terzo significato di "step"; si rinomina in ogni caso.
