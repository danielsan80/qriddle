---
name: svg-rendering
description: Opzioni e decisioni per il rendering SVG/PDF del puzzle
user-invocable: false
---

# SVG Rendering

## Stato attuale

- Rendering puzzle: Canvas (`src/lib/render/renderPuzzle.ts`)
- Export PDF: jsPDF (`src/lib/render/renderPdf.ts`) — converte canvas → PNG → PDF

## Opzioni per SVG

### Generazione stringa SVG

**Template literal** — zero dipendenze, leggibile, raccomandato per questo progetto:
```ts
const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#000" stroke-width="2">${lines.join('')}</g>
</svg>`
```

**svg.js** (`@svgdotjs/svg.js`) — API fluent, ~11KB gzipped. Vale la dipendenza se la complessità cresce:
```ts
const draw = SVG().size(300, 300)
draw.rect(100, 100).fill('#f06').move(10, 10)
const svgString = draw.svg()
```

**DOM API nativa** — nessuna dipendenza ma verbosa. Scartata.

### Download SVG

```ts
export function downloadSvg(svg: string, filename = 'puzzle.svg'): void {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
```

Vantaggio: modificabile con Inkscape, scalabile, nessuna dipendenza aggiuntiva.

## Opzioni SVG → PDF multipagina

**svg2pdf.js** (raccomandato) — mantiene vettori, qualità perfetta:
```ts
import { jsPDF } from 'jspdf'
import 'svg2pdf.js'

const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
await pdf.svg(svgElement1, { x: 0, y: 0, width: 210, height: 297 })
pdf.addPage()
await pdf.svg(svgElement2, { x: 0, y: 0, width: 210, height: 297 })
pdf.save('output.pdf')
```

**SVG → Canvas → PNG** (fallback) — rasterizzato, A4 @300dpi = 2480×3508px:
```ts
function svgToPng(svgString: string, w: number, h: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(blob)
  })
}
```

## Direzione attuale

Obiettivo: passare a SVG-first per supportare layout multipuzzle (biglietto auguri).
SVG generato → download diretto o conversione PDF via svg2pdf.js.