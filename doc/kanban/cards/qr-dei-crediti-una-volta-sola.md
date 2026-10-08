# Il QR dei crediti generato una volta sola

Passo 3 della card [La ventola parte nelle viste di modifica](ventola-nelle-viste-di-modifica.md),
spostato qui perché il guadagno è piccolo: circa 16 ms di `toDataURL` a ogni ingresso sul
retro.

Il QR punta sempre a `config.siteUrl`, con gli stessi colori, ma viene rigenerato in due
punti:

- `BackView`, in un effect al montaggio, quindi a ogni ingresso sul retro;
- `renderPdf.ts`, in `drawCredits`, a ogni anteprima e a ogni download.

Le due chiamate a `getQRDataUrl` ripetono gli stessi argomenti: oltre al costo, è la stessa
informazione in due posti. Proposta: una funzione in `lib` che genera il data URL alla
prima richiesta e restituisce la stessa promessa alle successive, usata da tutti e due.
