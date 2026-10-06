# Un esempio di coordinate più noto e più universale

Dal feedback di chi ha provato l'app (card Trello "Feedback QRiddle", aprile 2026). Riguarda l'esempio "the coordinates of an island" in `MapView`
(`ExampleLink code="rose"`, stato in `src/lib/util/examples.ts`). Due dubbi, sullo stesso
esempio:

- **il luogo**: l'Isola delle Rose è criptica se non se ne conosce la storia. Meglio un
  posto che tutti riconoscono (Nazca? Machu Picchu?);
- **il link**: Google Maps potrebbe non aprirsi bene senza account, o essere poco diffuso
  in altri paesi. Cercare qualcosa di più universale (OpenStreetMap? un URI `geo:`, che
  sul telefono apre l'app di mappe predefinita?).

## Decisioni (ottobre 2026)

L'esempio serve a chi crea il biglietto, per suggerirgli cosa nascondere nel QR: dal link
deve capire subito dove portano quelle coordinate.

- **Il luogo resta l'Isola delle Rose**: i testi dell'esempio sono costruiti sulla sua
  storia, e cambiarlo voleva dire riscriverli.
- **Il link resta Google Maps**, `https://www.google.com/maps?q=44.18,12.6167`: segnaposto
  sulle coordinate esatte, e il nome dell'isola compare sulla mappa lì accanto, perché
  Google ce l'ha fra i suoi luoghi. Si apre anche senza account. Il dubbio sui paesi dove
  Google non c'è pesa meno di un esempio che non si capisce.

Provati e scartati:

- **OpenStreetMap** con coordinate e zoom
  (`https://osm.org/?mlat=44.18&mlon=12.6167#map=10/44.18/12.62`): universale, ma il nome
  non compare. Il relitto c'è (nodo 8236909798, "Insulo de la Rozoj"), ma la mappa non
  scrive i nomi dei relitti in mare; senza zoom si vede solo azzurro.
- **Il nodo OSM del relitto** (`osm.org/node/8236909798`): nome e storia in un pannello,
  ma la mappa resta sull'azzurro, e il pannello non convince.
- **`geo:` con etichetta** (`geo:44.18,12.6167?q=44.18,12.6167(Isola+delle+Rose)`): su
  Android chiede con che app aprirlo, e Google Maps ignora l'etichetta e la usa come
  ricerca, spostando il segnaposto sul suo luogo invece che sulle coordinate.
