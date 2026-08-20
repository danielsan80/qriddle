#!/usr/bin/env python3
"""Generate the parchment texture used as the card background.

Writes images/bg.jpg, which inner_original.svg references by path, and swaps
the copy embedded as base64 in the two flattened SVGs the app actually loads.

The texture is a plain JPEG with no alpha. Whatever is not sheet is painted in
the page colour, which is also what comes out of a printer there: blank paper.
That is why the sheet runs edge to edge by default and the border is only
shaded -- see TEAR_DEPTH.

    python3 tools/generate-parchment.py

Needs numpy and Pillow. Nothing at build time depends on it -- the output is
committed, and this only runs when the texture itself should change.
"""

import base64
import re
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TEXTURE = ROOT / "src/assets/inner/images/bg.jpg"
EMBEDDING_SVGS = [
    ROOT / "src/assets/inner/inner.svg",
    ROOT / "src/assets/outer/outer.svg",
]

# 210:297 exactly (70:99 x 12), so the card SVGs draw the sheet at its own
# aspect ratio and nothing gets stretched.
WIDTH = 840
HEIGHT = 1188

# --- Knobs ------------------------------------------------------------------

# Any seed gives a different sheet in the same style.
SEED = 20260321

# Finest detail an octave is allowed to carry, in pixels. Noise is built by
# upscaling coarse random grids, so this is what decides whether the texture
# reads as crisp or as a blur.
FINEST_CELL_PX = 2.5

# How dark the border gets, and how far in the shading usually reaches as a
# fraction of half the sheet's width (0.11 is about 11 mm on an A4). The band
# is uneven by construction: it deepens in patches instead of drawing a frame.
EDGE_SHADE = 0.34
EDGE_REACH = 0.10

# Size of the folds, as the finest detail their noise is allowed to carry, in
# pixels. This is the knob for how big the creases come out: raise it for long
# sweeping folds, lower it for a fine crumpled web. The hairline cracks over
# the whole surface have their own, finer setting.
FOLD_SIZE_PX = 5
HAIRLINE_SIZE_PX = 3.0

# Every so often the shading runs further in than that, as a tongue rather than
# a wider frame. This is the multiplier those tongues reach at their deepest;
# at 1.0 the band keeps an even width all the way round.
EDGE_TONGUES = 6.5

# The four corners always darken, whatever the random fields are doing there --
# they are the part of a sheet that gets handled most. How far the corner wear
# spreads, again as a fraction of half the sheet's width.
CORNER_REACH = 0.65

# How deep the border is torn away, in the same units as EDGE_REACH. At 0 the
# sheet stays whole, which is what printing wants: a tear is not a torn sheet
# on paper, it is an unprinted gap. Around 0.05 gives visible bites.
TEAR_DEPTH = 0.0

# --- End of knobs -----------------------------------------------------------

# Luminance ramp, from the darkest part of the border to the lightest part of
# the sheet. Kept less saturated than a photograph would be: the card SVGs draw
# the sheet at opacity 0.55 so it never overpowers the ink on top of it.
PALETTE = [
    (0.00, (0x46, 0x25, 0x0C)),
    (0.20, (0x7B, 0x47, 0x1A)),
    (0.42, (0xA8, 0x71, 0x2F)),
    (0.62, (0xC8, 0x95, 0x52)),
    (0.80, (0xE0, 0xB4, 0x78)),
    (0.92, (0xEF, 0xD3, 0xA4)),
    (1.00, (0xF8, 0xE8, 0xC8)),
]

PAGE_COLOUR = (0xFF, 0xFF, 0xFF)

ASPECT = HEIGHT / WIDTH


def noise(rng: np.random.Generator, cells_x: int, cells_y: int) -> np.ndarray:
    """One octave of value noise: a coarse random grid, bicubically upscaled."""
    grid = rng.random((cells_y + 1, cells_x + 1))
    img = Image.fromarray((grid * 255).astype(np.uint8), mode="L")
    return np.asarray(img.resize((WIDTH, HEIGHT), Image.BICUBIC), dtype=np.float32) / 255.0


def octaves_down_to(cells: int, finest_cell_px: float = FINEST_CELL_PX) -> int:
    """How many halvings it takes to get from `cells` across to that detail."""
    return max(1, int(np.log2(WIDTH / (cells * finest_cell_px))) + 1)


def fbm(
    rng: np.random.Generator,
    cells: int,
    finest_cell_px: float = FINEST_CELL_PX,
    falloff: float = 0.5,
    stretch: float = 1.0,
) -> np.ndarray:
    """Fractional Brownian motion: octaves of value noise at falling amplitude.

    Runs from `cells` across the sheet down to grids whose cells are a few
    pixels wide. A high `falloff` keeps the fine octaves loud, which is what
    makes a surface look grainy rather than soft. `stretch` below 1 gives the
    grid fewer rows than columns, drawing the features out lengthways.
    """
    total = np.zeros((HEIGHT, WIDTH), dtype=np.float32)
    amplitude = 1.0
    weight = 0.0
    for octave in range(octaves_down_to(cells, finest_cell_px)):
        scale = cells * (2**octave)
        total += amplitude * noise(rng, scale, max(1, round(scale * ASPECT * stretch)))
        weight += amplitude
        amplitude *= falloff
    return total / weight


def creases(
    rng: np.random.Generator,
    cells: int,
    sharpness: float,
    finest_cell_px: float = FINEST_CELL_PX,
    stretch: float = 1.0,
) -> np.ndarray:
    """Fold lines: noise folded around its midpoint creases where it crosses
    the midpoint, and raising that to a power narrows the creases to lines.

    A crease appears at every crossing, so it is `finest_cell_px` -- not
    `cells` -- that decides how big the folds come out: the finest octave sets
    how often the field crosses the midpoint.
    """
    folded = 1.0 - np.abs(
        2.0 * fbm(rng, cells, finest_cell_px, falloff=0.62, stretch=stretch) - 1.0
    )
    return folded**sharpness


def relief(field: np.ndarray, strength: float) -> np.ndarray:
    """Light a field from the top left, so every ridge in it gets a bright side
    and a shaded one. Without this a crease reads as a stain, not as a fold."""
    lit = np.roll(np.roll(field, -1, axis=0), -1, axis=1)
    return strength * (lit - field)


def grain(rng: np.random.Generator) -> np.ndarray:
    """Paper fibres: per-pixel noise, stretched sideways into short streaks."""
    fine = rng.random((HEIGHT, WIDTH)).astype(np.float32)
    streaks = (
        np.asarray(
            Image.fromarray(
                (rng.random((HEIGHT, WIDTH // 6)) * 255).astype(np.uint8), mode="L"
            ).resize((WIDTH, HEIGHT), Image.BILINEAR),
            dtype=np.float32,
        )
        / 255.0
    )
    return 0.55 * fine + 0.45 * streaks


def border_offsets() -> tuple[np.ndarray, np.ndarray, float]:
    """Rows and columns as distances to the nearest border, and the unit both
    edge_distance and corner_distance are measured in."""
    rows = np.minimum(np.arange(HEIGHT), HEIGHT - 1 - np.arange(HEIGHT))
    cols = np.minimum(np.arange(WIDTH), WIDTH - 1 - np.arange(WIDTH))
    return rows[:, None], cols[None, :], min(WIDTH, HEIGHT) / 2.0


def edge_distance() -> np.ndarray:
    """0 at the sheet border, 1 towards the middle, on the shorter axis."""
    rows, cols, span = border_offsets()
    return np.minimum(rows, cols).astype(np.float32) / span


def corner_distance() -> np.ndarray:
    """0 at the nearest corner, growing away from it, in the same unit."""
    rows, cols, span = border_offsets()
    return np.hypot(rows, cols).astype(np.float32) / span


def smoothstep(
    edge0: float, edge1: float | np.ndarray, values: np.ndarray
) -> np.ndarray:
    """Ramp from 0 to 1 between the two edges. `edge1` may itself be a field,
    which is how the border shading reaches further in some places."""
    t = np.clip((values - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def stains(rng: np.random.Generator, count: int) -> np.ndarray:
    """Soft blotches, as if something was spilled long ago and dried."""
    ys, xs = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
    total = np.zeros((HEIGHT, WIDTH), dtype=np.float32)
    for _ in range(count):
        cy = rng.uniform(0.10, 0.90) * HEIGHT
        cx = rng.uniform(0.10, 0.90) * WIDTH
        radius = rng.uniform(0.05, 0.22) * WIDTH
        depth = rng.uniform(0.03, 0.10)
        squash = rng.uniform(0.6, 1.6)
        falloff = rng.uniform(0.8, 1.8)
        d2 = ((xs - cx) ** 2 + ((ys - cy) * squash) ** 2) / radius**2
        total += depth * np.exp(-(d2**falloff))
    return total


def colourise(luminance: np.ndarray) -> np.ndarray:
    stops = np.array([position for position, _ in PALETTE], dtype=np.float32)
    colours = np.array([colour for _, colour in PALETTE], dtype=np.float32)
    flat = np.clip(luminance, 0.0, 1.0).ravel()
    channels = [np.interp(flat, stops, colours[:, i]) for i in range(3)]
    return np.stack(channels, axis=-1).reshape(HEIGHT, WIDTH, 3)


def generate() -> Image.Image:
    rng = np.random.default_rng(SEED)

    luminance = np.full((HEIGHT, WIDTH), 0.90, dtype=np.float32)
    luminance += 0.20 * (fbm(rng, cells=2) - 0.45)
    luminance += 0.05 * (grain(rng) - 0.5)
    luminance -= 1.2 * stains(rng, count=11)

    # Creases at two scales: long folds running down the sheet, then a sparse
    # web of hairline cracks over all of it. Both are lit rather than merely
    # darkened, so they sit in the surface instead of on top of it.
    folds = creases(rng, cells=3, sharpness=7.0, finest_cell_px=FOLD_SIZE_PX, stretch=0.4)
    luminance += relief(folds, strength=0.22)
    luminance -= 0.055 * folds

    hairlines = creases(rng, cells=7, sharpness=18.0, finest_cell_px=HAIRLINE_SIZE_PX)
    luminance += relief(hairlines, strength=0.10)
    luminance -= 0.030 * hairlines

    # A worn border, darkened rather than cut away. Three fields keep it from
    # reading as a frame: the band's inner limit is frayed, its depth varies in
    # patches so stretches of the edge stay almost clean, and here and there it
    # runs inwards in a tongue.
    distance = edge_distance()
    fray = 0.011 * (fbm(rng, cells=26, finest_cell_px=4) - 0.5)
    edge = distance + fray
    patches = np.clip(fbm(rng, cells=4, finest_cell_px=24) - 0.46, 0.0, None)

    # Clipped well above the field's mean, so most of the border sits at the
    # base reach and only the occasional peak pushes towards the middle.
    peaks = np.clip(fbm(rng, cells=3, finest_cell_px=30) - 0.55, 0.0, None)
    reach = EDGE_REACH * (1.0 + (EDGE_TONGUES - 1.0) * np.minimum(peaks * 4.5, 1.0))

    luminance -= (
        EDGE_SHADE * (0.30 + 2.6 * patches) * (1.0 - smoothstep(0.0, reach, edge)) ** 1.5
    )

    # Corner wear darkens on its own account rather than by deepening the band
    # above. Folding it into the band would multiply two falloffs, and the
    # product dies along the diagonal exactly where the corner should be
    # darkest. A noise field varies it so the four corners differ.
    corners = (1.0 - smoothstep(0.0, CORNER_REACH, corner_distance())) ** 1.7
    corners *= 0.55 + 0.9 * fbm(rng, cells=2, finest_cell_px=40)
    luminance -= EDGE_SHADE * 1.15 * corners
    luminance -= 0.5 * EDGE_SHADE * (1.0 - smoothstep(0.0, 0.02, edge)) ** 2.0

    pixels = colourise(luminance)

    # Tears, off by default: past a ragged threshold there is no sheet left,
    # only the page underneath.
    if TEAR_DEPTH > 0.0:
        bites = np.clip(fbm(rng, cells=9, finest_cell_px=10) - 0.66, 0.0, None)
        pixels[edge - TEAR_DEPTH * (bites / 0.34) < 0.003] = PAGE_COLOUR

    return Image.fromarray(np.clip(pixels, 0, 255).astype(np.uint8), mode="RGB")


def embed(svg: Path, jpeg: bytes) -> None:
    """Replace the single embedded JPEG in a flattened card SVG."""
    text = svg.read_text(encoding="utf-8")
    payload = base64.b64encode(jpeg).decode("ascii")
    updated, count = re.subn(
        r'(data:image/jpeg;base64,)[^"]*',
        lambda match: match.group(1) + payload,
        text,
    )
    if count != 1:
        raise SystemExit(f"{svg.name}: expected 1 embedded JPEG, found {count}")
    svg.write_text(updated, encoding="utf-8")


def main() -> None:
    generate().save(TEXTURE, quality=88, optimize=True)
    jpeg = TEXTURE.read_bytes()
    print(f"wrote {TEXTURE.relative_to(ROOT)} ({len(jpeg)} bytes)")

    for svg in EMBEDDING_SVGS:
        embed(svg, jpeg)
        print(f"embedded into {svg.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
