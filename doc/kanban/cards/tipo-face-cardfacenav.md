# Rivedere il tipo `Face` in `CardFaceNav`

Sostituire il tipo stringa con punto (`'inner.map'`, `'outer.front'`…) con un union type strutturato, es. `{ page: 'inner' | 'outer'; face: 'map' | 'front' | 'back' | 'center' }`.
