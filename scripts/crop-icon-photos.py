"""Crops word-icon photos out of the licensed phonics flashcard reference
sheets in icon_refs/ (user-confirmed copyright-clear -- ours to crop and
ship as-is).

Each source sheet is a grid of flashcards (letter/digraph label on top,
illustration in the middle, caption word at the bottom). This script:
  1. Slices the sheet into grid cells (cols x rows).
  2. Sub-crops each cell to the illustration band only (a fixed fraction of
     the cell, tuned per sheet template to fall between the label and the
     caption -- see `CARD_BOX`/`CORNER_BOX` below).
  3. Trims to the tight content bounding box (vs. the sampled card
     background color) with a small pad.
  4. Flood-fills the background transparent from the crop's outer edge
     inward (BFS), so interior whites belonging to the illustration itself
     (a book's pages, a watch face) are never touched -- only background
     connected to the border is removed.
  5. Saves the result as a PNG in public/icons/.

Run from the repo root: `python3 scripts/crop-icon-photos.py`
(Requires Pillow -- no numpy dependency, this repo's macOS doesn't have it.)

To promote more flashcard icons later: open icon_refs/*.png with
Image.open(...).crop(...) at increasing grid coordinates to find the right
cell (see the chapter-09..14 comments in src/data/chapters/ for which
sound needs which word), add an entry below, and re-run. Then regenerate
src/icon-photos.js (the base64+size lookup `photoIcon()` in src/icons.js
reads) with the accompanying `gen-icon-photos-module.py` step at the
bottom of this file.
"""

import os
from collections import deque
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REFS = os.path.join(REPO, "icon_refs")
OUT = os.path.join(REPO, "public", "icons")
os.makedirs(OUT, exist_ok=True)


def load_grid_cell(sheet, cols, rows, row, col):
    im = Image.open(os.path.join(REFS, sheet)).convert("RGB")
    w, h = im.size
    cw, ch = w / cols, h / rows
    x0, y0 = col * cw, row * ch
    return im.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch)))


def content_bbox(im, bgs, tol):
    """bgs: list of (r,g,b) background candidates (see border_bg_colors) --
    a pixel counts as content only if it matches none of them."""
    w, h = im.size
    px = im.load()
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if not any(
                abs(r - bg[0]) <= tol and abs(g - bg[1]) <= tol and abs(b - bg[2]) <= tol
                for bg in bgs
            ):
                found = True
                minx, maxx = min(minx, x), max(maxx, x)
                miny, maxy = min(miny, y), max(maxy, y)
    return (0, 0, w, h) if not found else (minx, miny, maxx + 1, maxy + 1)


def border_bg_colors(im, quant=10, min_share=0.08):
    """Background candidates from the crop's outer ring, clustered by
    quantized color. A single corner pixel can land on a rounded card
    corner (green bleeding in) even when the vast majority of that same
    edge is the white card -- so this looks at the *whole* ring and keeps
    every color cluster covering at least `min_share` of it (typically
    both the white card and a sliver of the colored outer border), instead
    of trusting one corner sample.
    """
    w, h = im.size
    px = im.load()
    ring = []
    for x in range(w):
        ring.append(px[x, 0][:3])
        ring.append(px[x, h - 1][:3])
    for y in range(h):
        ring.append(px[0, y][:3])
        ring.append(px[w - 1, y][:3])
    buckets = {}
    for c in ring:
        key = tuple(v // quant for v in c)
        buckets.setdefault(key, []).append(c)
    total = len(ring)
    colors = []
    for key, members in buckets.items():
        if len(members) / total >= min_share:
            avg = tuple(sum(c[i] for c in members) // len(members) for i in range(3))
            colors.append(avg)
    return colors or [ring[0]]


def flood_transparent(im, tol=26):
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    bgs = border_bg_colors(im)

    def is_bg(r, g, b):
        return any(
            abs(r - bg[0]) <= tol and abs(g - bg[1]) <= tol and abs(b - bg[2]) <= tol
            for bg in bgs
        )

    visited = [[False] * w for _ in range(h)]
    dq = deque()
    for x in range(w):
        dq.append((x, 0))
        dq.append((x, h - 1))
    for y in range(h):
        dq.append((0, y))
        dq.append((w - 1, y))
    while dq:
        x, y = dq.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
            continue
        visited[y][x] = True
        r, g, b, a = px[x, y]
        if is_bg(r, g, b):
            px[x, y] = (r, g, b, 0)
            dq.append((x + 1, y))
            dq.append((x - 1, y))
            dq.append((x, y + 1))
            dq.append((x, y - 1))
    return im


def trim_edge_slivers(im, max_depth=4):
    """`flood_transparent` occasionally leaves a 1-3px fully-opaque
    line running the *entire* height or width right at the crop's edge --
    a sliver of the sheet's outer colored border that was too thin to
    register as its own background cluster and too different in color
    from the white card to match that cluster within tolerance (seen on
    `watch`/`thumb`/`fox`). A real illustration doesn't produce a
    perfectly solid, full-span line sitting exactly on the crop boundary,
    so this only clears a column/row within `max_depth` px of an edge when
    every pixel in it is still fully opaque -- it can't accidentally eat
    into content, which is never uniformly solid corner-to-corner like
    that.
    """
    w, h = im.size
    px = im.load()

    def col_alpha(x):
        return [px[x, y][3] for y in range(h)]

    def row_alpha(y):
        return [px[x, y][3] for x in range(w)]

    def clear_col(x):
        for y in range(h):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 0)

    def clear_row(y):
        for x in range(w):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 0)

    # `flood_transparent`'s BFS already clears the true edge itself in the
    # common case, leaving the residual sliver 1-2px *inward* from it (the
    # edge pixel was close enough to the white cluster, the next pixel in
    # wasn't). So this walks inward past any already-fully-transparent
    # columns/rows first, then clears a fully-opaque run it finds within
    # `max_depth`, and stops the moment it hits a column/row that's a mix
    # of opaque and transparent -- that mix is a real silhouette edge.
    def sweep(count, alpha_of, clear):
        x = 0
        cleared = 0
        while x < count and cleared < max_depth:
            alphas = alpha_of(x)
            if all(a == 0 for a in alphas):
                x += 1
                continue
            if all(a == 255 for a in alphas):
                clear(x)
                cleared += 1
                x += 1
                continue
            break

    sweep(w, col_alpha, clear_col)
    sweep(w, lambda x: col_alpha(w - 1 - x), lambda x: clear_col(w - 1 - x))
    sweep(h, row_alpha, clear_row)
    sweep(h, lambda y: row_alpha(h - 1 - y), lambda y: clear_row(h - 1 - y))
    return im


def process(sheet, cols, rows, row, col, frac_box, name, tol=16, pad=5):
    cell = load_grid_cell(sheet, cols, rows, row, col)
    cw, ch = cell.size
    fx0, fy0, fx1, fy1 = frac_box
    sub = cell.crop((int(fx0 * cw), int(fy0 * ch), int(fx1 * cw), int(fy1 * ch)))
    sw, sh = sub.size
    bgs = border_bg_colors(sub)
    x0, y0, x1, y1 = content_bbox(sub, bgs, tol)
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(sw, x1 + pad), min(sh, y1 + pad)
    tight = sub.crop((x0, y0, x1, y1))
    result = flood_transparent(tight, tol=26)
    result = trim_edge_slivers(result)
    outpath = os.path.join(OUT, f"{name}.png")
    result.save(outpath)
    print(name, "->", outpath, result.size)


# Sheet templates seen in icon_refs/ (2026-08 batch):
#   "card"   -- colored border, white rounded card, label/image/caption
#               stacked vertically (most sheets). frac box excludes both
#               text bands and stays inside the card's rounded corners.
#   "corner" -- black-ruled grid, label top-left, image lower-right, no
#               caption (the plain ABC alphabet sheet + the yoyo/zip pair).
CARD_BOX = (0.08, 0.37, 0.92, 0.79)
CARD_BOX_TIGHT = (0.14, 0.40, 0.86, 0.74)  # smaller cells (red OU/UE sheet)
CORNER_BOX = (0.40, 0.30, 0.96, 0.96)

A = "스크린샷 2026-08-25 오후 1.04.24.png"  # green sheet, 9x3, Group 5-7 digraphs
B = "스크린샷 2026-08-25 오전 11.14.29.png"  # red sheet, 7x3, ay/ou/ie/ea/oy/ir/ue etc
C = "스크린샷 2026-08-25 오전 11.07.55.png"  # ABC alphabet sheet, 4x6, corner style
D = "스크린샷 2026-08-25 오전 11.08.54.png"  # yoyo | zipper pair, corner style

if __name__ == "__main__":
    process(A, 9, 3, 2, 7, CARD_BOX, "zebra")
    process(A, 9, 3, 2, 4, CARD_BOX, "watch")
    process(A, 9, 3, 2, 3, CARD_BOX, "van")
    process(A, 9, 3, 1, 4, CARD_BOX, "book")
    process(A, 9, 3, 0, 3, CARD_BOX, "chips")
    process(A, 9, 3, 1, 8, CARD_BOX, "shoe")
    process(A, 9, 3, 2, 0, CARD_BOX, "thumb")
    process(A, 9, 3, 1, 7, CARD_BOX, "queen")
    process(A, 9, 3, 1, 2, CARD_BOX, "coin")
    process(A, 9, 3, 0, 6, CARD_BOX, "rubber")
    process(B, 7, 3, 0, 6, CARD_BOX_TIGHT, "glue")
    process(B, 7, 3, 0, 1, CARD_BOX_TIGHT, "cloud")
    process(C, 4, 6, 5, 3, CORNER_BOX, "fox")

    # yoyo: D is only 2 cells wide with no clean grid helper -- crop its
    # left half directly, then reuse the same corner-box + trim pipeline.
    im = Image.open(os.path.join(REFS, D)).convert("RGB")
    w, h = im.size
    left = im.crop((0, 0, w // 2, h))
    fx0, fy0, fx1, fy1 = CORNER_BOX
    sub = left.crop((int(fx0 * w // 2), int(fy0 * h), int(fx1 * w // 2), int(fy1 * h)))
    sw, sh = sub.size
    bgs = border_bg_colors(sub)
    x0, y0, x1, y1 = content_bbox(sub, bgs, 16)
    pad = 4
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(sw, x1 + pad), min(sh, y1 + pad)
    result = flood_transparent(sub.crop((x0, y0, x1, y1)), tol=26)
    result = trim_edge_slivers(result)
    result.save(os.path.join(OUT, "yoyo.png"))
    print("yoyo ->", os.path.join(OUT, "yoyo.png"), result.size)
