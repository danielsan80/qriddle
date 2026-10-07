# Strascichi del cambio di dominio

Dopo lo spostamento su `qriddle.app` (vedi
[Spostare l'app su qriddle.app](dominio-qriddle-app.md)), da fare a mano:

- **certificato di `www.qriddle.app`**: il record `CNAME` c'è, e in HTTP `www` reindirizza
  già al dominio principale; il certificato che copre anche `www` GitHub lo stava
  emettendo. Se non arriva, togliere e rimettere il dominio nelle impostazioni di Pages
  perché lo riemetta. Finché manca, `www.qriddle.app` dà errore di certificato, perché
  `.app` impone HTTPS;
- **Google Search Console**: `qriddle.app` come proprietà, e la sitemap. Il "cambio di
  indirizzo" non serve: vale per un dominio intero, non per una sottocartella;
- **LinkedIn**: rinfrescare col Post Inspector l'anteprima dei post che citavano il
  vecchio indirizzo;
- **Ko-fi**: il link sulla pagina, se cita l'indirizzo dell'app.

Sito, CV e LinkedIn come contenuti sono lavoro di danilosanchi.net: si aggiorna la sua
fonte, e il resto si ricava da lì.
