# Il PageObject di `CopyLink`

`CopyLink.test.tsx` ha `renderWithFakeTimers` e `clickAndWait` come funzioni locali del
test, e le asserzioni interrogano `screen` direttamente. Dal 2026-10-20 i principi di
scrittura del codice (`~/.claude/rules/coding-principles.md`) dicono che, quando il test usa
una pagina o un componente, gli helper sono metodi del suo PageObject.

Da fare: `CopyLinkPage` in `src/components/CopyLink/CopyLink.page.ts`, come
`MobileBlock.page.ts`, con `clickAndWait` e il bottone da interrogare nelle asserzioni.

Lo spike su [`CardFaceEditor`](spike-pageobject-e-ordine-degli-eventi.md) non c'entra: qui
non c'è un ordine di eventi da proteggere.
