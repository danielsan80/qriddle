# Spike: un PageObject per i test dei componenti?

**Domanda aperta, nessuna decisione presa.** Va deciso se conviene introdurre un
PageObject (o comunque un oggetto che parli la lingua del dominio) davanti ai test dei
componenti, oppure se il costo supera il beneficio in un progetto di questa taglia.

## Da dove nasce

In `CardFaceEditor.test.tsx` esiste già un abbozzo di PageObject, cresciuto per necessità e
mai chiamato così: `renderHarness`, `renderEditor`, `openEditorOn`. Sono tre funzioni che
fanno esattamente il mestiere — nascondere il gesto e restituire un modo per interrogare lo
stato. La domanda è se conviene riconoscerlo e completarlo, o lasciarlo abbozzo.

## Cosa spinge a favore

- **I test parlano la lingua del browser, non del biglietto.** Un `mouseDown` con delle
  coordinate seguito da un `mouseUp` sulla finestra significa "apri l'editor su questa
  casella". Lo dice già `openEditorOn`, ma per un caso solo.
- **Le query sono legate alla grafica.** `getByRole('button', { name: '×' })` si rompe il
  giorno che la × diventa un'icona. Un `deleteButton()` in un posto solo assorbe il colpo.
- **La rinomina di oggi ha toccato cinque `describe`** oltre al codice. Con un oggetto
  intermedio il nome del componente comparirebbe in un punto.
- Toglierebbe da solo una parte dei commenti — vedi
  [Potare i commenti nei test](potare-i-commenti-nei-test.md).

## Cosa spinge contro

- **Il problema è di un file su diciannove.** Gli altri test non ne sentono la mancanza:
  quelli di dominio non hanno DOM, gli altri componenti sono piccoli. Una convenzione
  introdotta per un caso solo di solito non attecchisce.
- **L'indirezione allontana il motivo del fallimento.** Un test rosso oggi indica la riga
  del gesto; con un PageObject indica un metodo, e il perché sta un file più in là.
- **Rischio specifico di questo componente:** metà dei suoi test esistono per fissare
  l'**ordine degli eventi** (mousedown → blur → click, il `preventDefault` sul mousedown dei
  bottoni). Un metodo che impacchetta la sequenza nasconde esattamente la cosa che il test
  deve dimostrare. Se si adotta, i test sull'ordinamento restano scritti a mano.

## Come rispondere

Indagine a tempo, non un rifacimento. Prendere **due** test di `CardFaceEditor.test.tsx` —
uno sul ciclo di vita delle caselle e uno sulla chiusura per blur, che è il caso ostile —
riscriverli con un PageObject e metterli accanto agli originali. Poi guardare la coppia e
decidere.

Criterio di risposta: il test riscritto deve restare **leggibile senza aprire il
PageObject**, e deve continuare a far vedere l'ordine degli eventi dove è quello il punto.
Se per capire il test bisogna saltare a un altro file, la risposta è no.

Esito atteso: una risposta scritta qui — sì, no, o "sì ma solo per le query" — e, se è sì,
una riga nelle regole di progetto. Non codice.

## Card collegate

- [Scomporre `CardFaceEditor`](scomporre-cardfaceeditor.md) — se il componente si spezza in
  pezzi più piccoli, ognuno testabile per conto suo, il bisogno di un PageObject cala.
  Conviene sapere l'esito di questo spike prima di scomporre, non dopo.
- [Potare i commenti nei test](potare-i-commenti-nei-test.md) — da fare dopo questo.
