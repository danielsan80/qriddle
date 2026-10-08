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

A ogni cambio di passo, `window.umami?.track('step', { step })`, con il solo codice del passo
(`'inner.map'`, `'outer.front'`…): niente del lavoro. È lo stesso meccanismo dell'evento
`download` già in `DownloadView`. Ne esce un funnel: quanti arrivano alla mappa, alle
facciate, al download.

Va fatta prima della revisione dell'Intro, che è ciò che dovrà misurare.

Da decidere: dove chiamarlo (il context, che conosce ogni cambio di passo, o `StepView`) e
se contare anche i passi aperti da un link incollato.

## Per misurare pulito

Le mie visite vanno escluse: nel browser che uso, sulla Console di `qriddle.app`,
`localStorage.setItem('umami.disabled', 1)`.
