---
name: front-view-refactor
description: Refactor FrontView — separazione dato/tool/view per textbox su SVG
user-invocable: true
---

# FrontView — Refactor

## Problema

`FrontView` è difficile da leggere e revisionare perché mescola tre responsabilità distinte.

## Tre strati identificati

### 1. Dato — `TextBox`

Tipo puro già definito in `FrontView.tsx`:

```ts
interface TextBox {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
}
```

Andrà in uno store condiviso tra viste (fronte, retro, ecc.) per il ripristino. Per ora può restare in stato locale, ma la struttura è quella giusta. Oltre ai textbox, ci saranno altri elementi SVG (es. il puzzle) che il sistema dovrà gestire.

### 2. Tool UI — `SvgTextEditor` (nome provvisorio)

Componente riutilizzabile per apporre textbox su un SVG o porzione di esso. Interfaccia proposta:

```tsx
<SvgTextEditor
  viewBox="..."
  textBoxes={textBoxes}
  onAdd={handleAdd}
  onChange={handleChange}
  onDelete={handleDelete}
>
  {/* contenuto SVG specifico della vista */}
  <image href={outerSvgUrl} ... />
</SvgTextEditor>
```

Gestisce internamente:

- drag per spostare textbox
- click su area vuota per creare un nuovo textbox
- editing overlay (input testo, size +/−, delete)
- conversione coordinate SVG ↔ container

Non sa nulla di `outer.svg`, del puzzle, o della vista specifica.

### 3. View — `FrontView`

Diventa sottile: fornisce il `viewBox` corretto, il contenuto SVG specifico (outer.svg + puzzle), e per ora detiene lo stato `TextBox[]` localmente.

## Stato attuale di FrontView

- `FrontView.tsx` — ~280 righe, tutto mescolato
- `FrontView.module.css` — stili dell'overlay di editing (input, sizeBtn, deleteBtn) che seguiranno il tool

## Decisione pendente

Refactor subito vs. aggiungere prima una seconda vista (es. retro) per avere due casi d'uso reali prima di definire il contratto del tool. Il rischio del refactor anticipato è over-ingegnerizzare l'API del componente su un solo caso.

## Prossimi passi

1. Decidere se procedere subito o aspettare la seconda vista
2. Estrarre `SvgTextEditor` con i suoi stili
3. Ridurre `FrontView` al solo assemblaggio
4. Esportare `TextBox` come tipo condiviso
