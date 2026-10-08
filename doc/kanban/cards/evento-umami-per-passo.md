# Un evento Umami a ogni cambio di passo

Fino al 2026-10-08 ogni passo del wizard cambiava l'hash, e Umami lo contava come una
pagina vista: era l'unico segnale di quanto avanti si spinge un visitatore. Con
`data-exclude-hash="true"`, introdotto per tenere il lavoro (e il testo segreto) lontano da
Umami, quel segnale non c'è più.

## Cosa dicevano i dati prima

Sessioni di ottobre fino all'8, con il dominio `qriddle.app` attivo da due giorni: 33. Le
mie, gonfiate dall'hash, a parte. Le altre quasi tutte con **1 pagina vista e 0 eventi**:
molte da città di data center (Council Bluffs, Boardman, Ashburn, Falkenstein), quindi
crawler e anteprime dei link; le poche che sembrano persone non vanno oltre l'Intro. Dato
piccolo, ma nella direzione della card
[Revisione della comunicazione della prima vista (Intro)](revisione-comunicazione-intro.md).

## Proposta

A ogni cambio di passo, l'evento `step-changed`, con il solo codice del passo
(`'inner.map'`, `'outer.front'`…): niente del lavoro. È lo stesso meccanismo dell'evento
di download già in `DownloadView`. Ne esce un funnel: quanti arrivano alla mappa, alle
facciate, al download.

Va fatta prima della revisione dell'Intro, che è ciò che dovrà misurare.

## Decisioni

- **Nel context**, in `handleSetStep`, da cui passano Previous, Next e la barra laterale.
- **Solo i cambi fatti da chi usa l'app.** Un link incollato apre il suo passo senza evento:
  altrimenti un link aperto direttamente sul download sembrerebbe un percorso completo.
- **Niente evento verso il passo già mostrato**, come il click sull'etichetta del passo
  corrente: sarebbe rumore.
- **Una porta, non un event bus.** `src/lib/browser/analytics.ts` espone un fatto per
  funzione (`stepChanged`, `downloadRequested`): context e `DownloadView` non sanno che
  dietro c'è Umami, e nei test si sostituisce la porta. Il bus avrebbe un solo ascoltatore e
  renderebbe indiretto il flusso; se arriva un secondo consumatore, è la porta a emettere
  sul bus e chi la chiama non cambia.
- **Nomi al passato**, perché un evento è un fatto: `step-changed` e
  `download-requested`. Il secondo prende il posto di `download`, e dice quello che si sa
  davvero: parte al click, prima che il PDF sia generato. Lo storico di `download` resta
  separato, ma conteneva solo i miei download di prova.

In Umami gli eventi si leggono in Events, con la proprietà `step`.

## Per misurare pulito

Le mie visite vanno escluse: nel browser che uso, sulla Console di `qriddle.app`,
`localStorage.setItem('umami.disabled', 1)`.
