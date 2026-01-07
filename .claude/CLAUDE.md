# Regole progetto

Regole sintetiche: scrivi il minimo necessario per essere compresi.

- Dopo `npm run dev`, fornisci solo il link (http://localhost:5173). Non verificare l'output del server.
- Usa CSS Modules con nesting nativo per i componenti React.
- Termina i file con newline.
- Commenti nel codice in inglese.
- Feedback onesto: evidenzia problemi e alternative migliori senza giri di parole.

## Riferimento temporaneo

File sorgente da cui stiamo portando il codice in React:
`/home/danilo/www/lab/smart-greeting-card/doc/tmp/qr-puzzle-generator-fixed.html`

## Domain Model (WIP)

### Value Objects

**Coord** — posizione (row, col)

**Color** — `'black' | 'white'` (enum)

**Edge** — bordo di una cella

- `isExternal: boolean` — bordo esterno della griglia
- `hasWall: boolean` — presenza del muro

**Edges** — { top, right, bottom, left: Edge }

### Input Context

**Cell** (VO)

- `coord: Coord`
- `color: Color`

**Grid** — contenitore di Cell

- `size: number` — dimensione (griglia quadrata)
- `get(coord: Coord): Cell`
- `has(coord: Coord): boolean` — verifica bounds
- `forEach(callback: (cell: Cell) => void)`

### Output Context (Maze)

**MazeCell** (Entity)

- `coord: Coord`
- `color: Color`
- `edges: Edges` — bordi della cella
- `neighbors: Coord[]` — celle geometricamente adiacenti
- `passages: Coord[]` — celle connesse (senza muro)
- `marked: boolean` — puntino di partenza per il flood fill (solo celle nere)

**Maze** — contenitore di MazeCell

- `size: number`
- `get(coord: Coord): MazeCell`
- `has(coord: Coord): boolean`
- `forEach(callback: (cell: MazeCell) => void)`
