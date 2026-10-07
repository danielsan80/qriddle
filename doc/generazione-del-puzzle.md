# Generazione del puzzle

Il problema che il puzzle risolve e l'algoritmo da cui siamo partiti. Il codice sta in
`src/lib/domain/puzzle/`.

## Problema

Abbiamo diverse Aree monocromatiche di tile (Cell) quadrate adiacenti ortogonalmente.
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
