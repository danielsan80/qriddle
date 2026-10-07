# Strascichi del cambio di dominio

Il lavoro a mano dopo lo spostamento su `qriddle.app` (vedi
[Spostare l'app su qriddle.app](dominio-qriddle-app.md)):

- Ko-fi, sito, CV e profilo LinkedIn citano il nuovo indirizzo;
- il certificato di `www.qriddle.app` è stato emesso dopo aver tolto e rimesso il dominio
  nelle impostazioni di Pages;
- su Google Search Console `qriddle.app` è una proprietà di tipo Dominio, verificata col
  record TXT. Il "cambio di indirizzo" non serve: vale per un dominio intero, non per una
  sottocartella;
- il Post Inspector di LinkedIn ha riletto il vecchio e il nuovo indirizzo; nessun post
  citava qriddle, solo il link fra i contenuti multimediali del progetto.

Da ricontrollare: la sitemap, inviata il 7 ottobre, deve passare da "Impossibile
recuperare" a "Riuscito". Se resta ferma per giorni con una data in "Ultima lettura",
provare `https://qriddle.app/sitemap.xml` con Controllo URL, "Testa URL live".
