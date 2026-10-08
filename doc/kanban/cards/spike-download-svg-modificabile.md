# [Spike] Download SVG modificabile

Capire se ha senso e se è fattibile esportare il biglietto come SVG (oltre che PDF), in modo da poterlo aprire e modificare con Inkscape o simili. Valutare: il puzzle generato dinamicamente è rappresentabile in SVG? il testo dei campi della wizard si integra bene?

## Analisi già fatte (marzo 2026)

Dalla skill `svg-rendering`, tolta l'8 ottobre 2026.

### La pipeline

```
oggi:      puzzle (canvas) → PNG → jsPDF → .pdf
SVG-first: puzzle (SVG) → compositing SVG → svg2pdf.js → .pdf
                                          → download .svg (Inkscape)
```

- **Il puzzle è già rappresentabile in SVG.** `renderPuzzle.ts` disegna solo rettangoli,
  linee e cerchi: un `renderPuzzleSvg()` si scrive usando il codice canvas come
  riferimento. È il primo passo dello spike: costo basso, e sblocca download SVG, qualità
  vettoriale nel PDF e multipuzzle.
- **Lo sfondo è già SVG**, con le immagini incorporate in base64: Inkscape lo apre da solo.
  Il puzzle diventa un `<g>` posizionato dentro lo sfondo, senza rasterizzare.
- **I testi** sono `<text>` SVG, come già nelle viste di modifica.

### Librerie

- **Generare l'SVG**: template literal, senza dipendenze. `svg.js` (`@svgdotjs/svg.js`,
  circa 11 kB gzip) solo se la complessità cresce. Scartata la DOM API nativa, troppo
  verbosa.
- **SVG → PDF**: `svg2pdf.js` sopra jsPDF, che tiene i vettori. In alternativa SVG → canvas →
  PNG, rasterizzato: A4 a 300 dpi sono 2480×3508 pixel, come oggi.
- **Download**: un `Blob` di tipo `image/svg+xml` e un link con `download`, senza
  dipendenze.

### Font

Inkscape non mostra i font incorporati con `@font-face` e data URL in base64, né in
`<style>` né dentro `<defs>`: provati entrambi. Convertire il testo in tracciati (es. con
opentype.js) lo rende non modificabile, e toglie il senso dell'SVG scaricabile.

Conclusione di allora: uno ZIP con l'SVG della facciata, il file del font e un README che
spiega di installare il font prima di aprire l'SVG. Il font di allora era commerciale ed è
stato tolto (card [Ripulire il repo come vetrina](repo-vetrina-e-asset.md)); quello attuale,
Corinthia, è sotto OFL e si può ridistribuire insieme alla sua licenza
(`src/assets/fonts/Corinthia-OFL.txt`).
