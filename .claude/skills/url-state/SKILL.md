---
name: url-state
description: Decisioni architetturali per la persistenza dello stato nell'URL (hash fragment + LZ-string + JSON). Usare quando si implementa o discute la condivisione dello stato via URL, bookmarking, o ripristino della configurazione da URL.
user-invocable: false
---

# URL State — Persistenza dello stato nell'URL

## Obiettivo

Permettere di copiare l'URL e riottenere la stessa configurazione del wizard: textbox, seed, step attivo.

## Decisioni architetturali

### Hash fragment, non query string

Usare `#state=<valore>` invece di `?state=<valore>`.

- Non viene inviato al server
- Non triggera page reload al cambio
- Semanticamente corretto per stato client-only

### LZ-string per la compressione

Usare la libreria `lz-string` (piccola, purpose-built per URL):

```ts
import LZString from 'lz-string';

const encoded = LZString.compressToEncodedURIComponent(JSON.stringify(state));
const decoded = JSON.parse(LZString.decompressFromEncodedURIComponent(encoded));
```

Molto più compatto di base64 puro su JSON.

### `replaceState` vs `pushState`

- **Navigazione tra step**: usare `'push'` → permette back/forward del browser
- **Modifiche a testo e config**: usare `'replace'` (default) → evita di riempire la history con ogni carattere digitato

`mergeState` e `writeState` accettano un `HistoryMode = 'push' | 'replace'` (default `'replace'`):

```ts
mergeState({ step: 'front' }, 'push'); // pushState
mergeState({ textBoxes }); // replaceState
```

### Cosa storare

Le immagini sono fisse nel repo → non serve storarle.

Storare solo stato non derivabile:

- `imageId` — identificatore dell'immagine scelta
- `seed` — stringa per la generazione del puzzle
- `textboxes` — contenuto e posizioni dei textbox per facciata
- `step` — facciata/step attivo (opzionale, migliora UX)

Non storare stato derivato: il puzzle è deterministico da `imageId + seed`.

## Struttura JSON

```ts
interface UrlState {
  imageId: string;
  seed: string;
  step?: string;
  textboxes: Record<string, TextboxState[]>;
}
```

## Pattern implementativo consigliato

Un hook `useUrlState` che:

1. Al mount: legge e decodifica l'hash, inizializza lo stato
2. Ad ogni cambio di stato: riscrive l'hash con `replaceState`
3. Gestisce errori di parsing (hash corrotto → stato default)

```ts
function useUrlState<T>(defaultState: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const hash = window.location.hash.slice('#state='.length);
      if (!hash) return defaultState;
      return JSON.parse(LZString.decompressFromEncodedURIComponent(hash));
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    const encoded = LZString.compressToEncodedURIComponent(
      JSON.stringify(state),
    );
    window.history.replaceState(null, '', `#state=${encoded}`);
  }, [state]);

  return [state, setState] as const;
}
```
