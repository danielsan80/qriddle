# CI: azioni su Node 24 e Playwright da immagine

Dal primo deploy con la fitness function (2026-10-08, run 37811647620) emergono due cose
indipendenti.

## Azioni su Node 24

GitHub segnala che `actions/checkout@v4`, `actions/setup-node@v4` e
`actions/upload-artifact@v4` (dentro `upload-pages-artifact@v3`) girano su Node.js 20,
deprecato, e per ora le forza su Node 24. È il runtime delle azioni, non quello della
build: si risolve passando alle versioni delle azioni che girano su Node 24. Nello stesso
passo, `node-version: 20` del workflow sale a una versione supportata.

## Playwright da immagine

Il job di build dura 1 minuto; `npx playwright install --with-deps chromium` ne prende 25 s.
L'immagine ufficiale `mcr.microsoft.com/playwright:v<versione>-noble`, come `container:` del
job, ha già Chromium e le sue dipendenze. Costa il pull, intorno al GB: si tiene solo se il
job misurato risulta più breve.

Diversamente da coffeebreak-2 (`resolvi/e2e-runner`), qui non serve pubblicare un'immagine
propria: lì serve anche Docker Compose. Da coffeebreak si riprende invece il controllo che
il tag dell'immagine corrisponda alla versione di `@playwright/test` in `package.json`, con un
messaggio che dice cosa allineare.
