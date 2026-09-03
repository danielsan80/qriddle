# Modificare una facciata cancella quelle successive

Segnalato il 2026-09-03: in certi casi modificare una facciata fa sparire le caselle delle
facciate seguenti. Chi l'ha visto sospettava il click su **Next** con una casella ancora
aperta, senza aver confermato cliccando sull'SVG.

## Ipotesi principale: la cronologia riporta indietro una fotografia vecchia

Dedotta leggendo, **non ancora provata**. Non c'entra il momento della conferma: c'entra il
tasto **Previous**, e basta passare da lì una volta.

Ci sono due scritture nell'URL, con due modi diversi:

- `WizardContext.handleSetTrackStep` → `mergeState({ step }, 'push')` — cambio di passo,
  **push**: crea una voce nuova nella cronologia, che congela l'URL **com'è in quel
  momento**, caselle comprese;
- `useOuterTextBoxes` → `mergeState({ textBoxes }, 'replace')` — ogni modifica di una
  casella, **replace**: riscrive **solo la voce corrente**.

Da qui la sequenza che perde i dati:

| #   | gesto            | cosa finisce nella cronologia                            |
| --- | ---------------- | -------------------------------------------------------- |
| 1   | Front: scrivo A  | replace → `[A]`                                          |
| 2   | Next             | **push** `{step: center, textBoxes: [A]}`                |
| 3   | Center: scrivo B | replace → `[A, B]`                                       |
| 4   | Next             | **push** `{step: back, textBoxes: [A, B]}`               |
| 5   | Back: scrivo C   | replace → `[A, B, C]`                                    |
| 6   | **Previous**     | `history.back()` → torna alla voce del passo 4: `[A, B]` |

Al passo 6 **C non è più nell'URL**. Non è ancora un danno visibile — è la voce di
cronologia precedente, che C non l'ha mai contenuta. Ma appena si tocca una casella su
quella facciata scatta un `replace` che riscrive l'array partendo da `[A, B]`, e **C è
perso per sempre**. Da qui il sintomo: "modifico una facciata e le successive spariscono".

Il tasto Previous è `history.back()` (`StepView.tsx:44`), quindi ci si passa senza fare
niente di strano.

## Ipotesi secondaria, da escludere

Quella del segnalatore: Next cliccato con l'editor aperto. `handleSetTrackStep` fa
`mergeState({ step }, 'push')` **in modo sincrono dentro il gestore del click**, mentre la
scrittura delle caselle passa da un `useEffect`. Se l'effetto non avesse ancora girato, il
push congelerebbe l'array **precedente** alla modifica.

In teoria non succede: il blur e il click sono due eventi distinti, React fa il flush del
primo (ed esegue i suoi effetti) prima di consegnare il secondo. Da verificare comunque,
perché è il caso che è stato osservato davvero.

## Come provarlo

A mano, sull'app, seguendo la tabella qui sopra: tre facciate, una casella ciascuna, poi
Previous e una modifica. Basta guardare l'hash dell'URL prima e dopo.

Con un test è più difficile: serve la cronologia vera, e in jsdom `history.back()` e
`popstate` si comportano diversamente da un browser. Se il test è fragile, meglio un test
sull'invariante — _una scrittura di caselle non deve mai partire da un array più vecchio di
quello nell'URL_ — che sul gesto.

## Radice, e cosa la toglie

La causa non è il tasto Previous: è che **lo stato vive in due posti**. `useOuterTextBoxes`
tiene una copia dell'array intero, fotografata al montaggio, e la riscrive tutta a ogni
modifica; la cronologia ne tiene altre, congelate ai cambi di passo. Finché è così, ogni
salto indietro può resuscitare una copia vecchia.

Stessa radice della card
[`useOuterTextBoxes`: l'ordine cambia da solo, e ogni vista ha la sua copia](ordine-e-copia-in-useoutertextboxes.md),
che va letta insieme a questa. La correzione che le chiude entrambe è tenere le caselle in
un posto solo sopra le viste, invece di una copia per hook.

Rimedio minimo, se la radice non si tocca: leggere l'URL al momento della scrittura invece
di partire dalla copia in stato — `mergeState` già rilegge, ma per fondere `step`, non le
caselle.
