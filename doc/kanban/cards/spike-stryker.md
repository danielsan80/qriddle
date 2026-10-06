# Mutation testing con Stryker

Per verificare che un test nuovo protegga davvero il codice, oggi lo muto a mano:
cambio una costante o tolgo una riga, e controllo che un test fallisca. Funziona, ma
costa tempo e si sbaglia facilmente: col bottone Save una mutazione fatta con `sed` non
aveva toccato il file, e i test sembravano reggere.

[Stryker](https://stryker-mutator.io/) fa la stessa cosa in automatico, con un runner per
Vitest.

Da scoprire:

- se gira con la configurazione di Vitest del progetto (jsdom, CSS Modules);
- quanto ci mette sui soli file cambiati, rispetto all'intero `src/`;
- se su `CopyLink` uccide i mutanti che ho provato a mano (timeout a 4 e 6 secondi,
  `clearTimeout` tolto), e cosa trova in più;
- quanti mutanti equivalenti produce, cioè falsi allarmi da ignorare;
- dove metterlo: dentro `npm run check`, o come comando a parte da lanciare prima di
  consegnare.

La risposta attesa: tenerlo o no, e se sì con quale comando.
