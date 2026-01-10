# Regole progetto

Regole sintetiche: scrivi il minimo necessario per essere compresi.

- Dopo `npm run dev`, fornisci solo il link (http://localhost:5173). Non verificare l'output del server.
- Usa CSS Modules con nesting nativo per i componenti React.
- Termina i file con newline.
- Commenti nel codice in inglese.
- Feedback onesto: evidenzia problemi e alternative migliori senza giri di parole.
- Test first: scrivi i test prima dell'implementazione.

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

## Problema

Abbiamo diverse Aree monocromatiche di tile (MazeCell) quadrate adiacenti ortogonalmente.
Per ciascuna Area abbiamo bisogno di piazzare dei muri tra le tile adiacenti in modo che
da ogni tile sia possibile raggiungere ogni altra tile dell'area.
Esistono dei muri anche sui confini esterni dell'area, fissi e irremovibili.
Definiamo blocchi 2x2 una sottoarea di 4 tile disposte a quadrato tra le quali non è piazzato alcun muro.
Nella soluzione finale non devono essere presenti blocchi 2x2.

## Algoritmo per la generazione dei percorsi: Spanning tree + bias direzionale + post-processing (WIP)

Algoritmo suggerito da ChatGPT per la soluzione al suddetto problema.

### Strutture dati minime

```
    Cell:
        x, y
        walls[4]        // N E S W, true = muro
        visited         // per DFS

    Grid:
        width, height
        cells[width][height]
```

#### Direzioni:

```
    DIRS = [N, E, S, W]
    dx = {N:0, E:1, S:0, W:-1}
    dy = {N:-1, E:0, S:1, W:0}
    opposite = {N:S, E:W, S:N, W:E}
```

### 1) DFS con bias direzionale (labirinto serpentino)

```
    function generateMaze(grid, biasStraight):
        start = randomCell(grid)
        stack = empty stack

        start.visited = true
        push(stack, (start, NONE))

        while stack not empty:
            (cell, lastDir) = peek(stack)

            neighbors = unvisitedNeighbors(cell)

            if neighbors empty:
                pop(stack)
                continue

            dir = chooseDirection(neighbors, lastDir, biasStraight)
            next = cell + dir

            removeWall(cell, dir)
            removeWall(next, opposite(dir))

            next.visited = true
            push(stack, (next, dir))
```

#### Scelta direzione con bias

```
    function chooseDirection(neighbors, lastDir, biasStraight):
        weights = empty list

        for dir in neighbors:
            if dir == lastDir:
                weight = biasStraight        // es 0.7 – 0.9
            else:
                weight = (1 - biasStraight) / (neighbors.count - 1)

        add (dir, weight) to weights

    return weightedRandom(weights)
```

Risultato:

- biasStraight alto → corridoi lunghi
- nessun ciclo
- nessun blocco 2x2
