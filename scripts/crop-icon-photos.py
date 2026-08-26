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


def keep_largest_component(im, connectivity=8):
    """Zeroes every connected blob of opaque pixels except the largest one.

    `flood_transparent` only removes background *connected to the crop's
    outer edge* -- it can't tell a stray disconnected fragment (a caption
    letter, a card-border sliver) from real content once that fragment
    sits fully inside the crop with a thin white gap around it. Several
    icons in this batch needed generous crop boxes (to stop clipping real
    artwork -- see the 2026-08 clipping-fix pass) that, as a side effect,
    pulled in a nearby label/caption glyph as a second, smaller, disjoint
    blob. This keeps only the biggest blob (the illustration itself, which
    is always larger than a single stray letter) and erases the rest.
    Do not use this where the illustration legitimately has small
    disconnected parts (e.g. dotted decoration) that must survive -- check
    the result renders before trusting it.
    """
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    visited = [[False] * w for _ in range(h)]
    neigh = (
        [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
        if connectivity == 8
        else [(0, -1), (0, 1), (-1, 0), (1, 0)]
    )
    best, best_size = None, 0
    for sy in range(h):
        for sx in range(w):
            if visited[sy][sx] or px[sx, sy][3] == 0:
                continue
            q = deque([(sx, sy)])
            visited[sy][sx] = True
            comp = []
            while q:
                x, y = q.popleft()
                comp.append((x, y))
                for dx, dy in neigh:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and px[nx, ny][3] > 0:
                        visited[ny][nx] = True
                        q.append((nx, ny))
            if len(comp) > best_size:
                best, best_size = comp, len(comp)
    keep = set(best or [])
    for y in range(h):
        for x in range(w):
            if (x, y) not in keep and px[x, y][3] > 0:
                r, g, b, a = px[x, y]
                px[x, y] = (r, g, b, 0)
    return im


def process_abs(source, box, name, tol=16, pad=5, keep_largest=False):
    """Like `process()` but takes an absolute (x0,y0,x1,y1) pixel box in the
    source sheet instead of a grid cell + fractional sub-box. Used for the
    2026-08 clipping-fix pass, where each icon needed a hand-picked box
    (see icon_refs/staging/catalog.json history / CLAUDE.md) rather than a
    template box shared across a sheet's cells.
    """
    im = Image.open(os.path.join(REFS, source)).convert("RGB")
    crop = im.crop(box)
    cw, ch = crop.size
    bgs = border_bg_colors(crop)
    x0, y0, x1, y1 = content_bbox(crop, bgs, tol)
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(cw, x1 + pad), min(ch, y1 + pad)
    tight = crop.crop((x0, y0, x1, y1))
    result = flood_transparent(tight, tol=26)
    if keep_largest:
        result = keep_largest_component(result)
    result = trim_edge_slivers(result)
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
    outpath = os.path.join(OUT, f"{name}.png")
    result.save(outpath)
    print(name, "->", outpath, result.size)


def process_standalone(source, name, tol=16, pad=5, keep_largest=False):
    """Like `process_abs()` but for a standalone reference image that is
    already just the illustration on a flat background (no flashcard grid
    to slice into) -- e.g. a single asset the user supplies directly. Takes
    the whole image as the box.
    """
    im = Image.open(os.path.join(REFS, source)).convert("RGB")
    w, h = im.size
    process_abs(source, (0, 0, w, h), name, tol=tol, pad=pad, keep_largest=keep_largest)


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
D2 = "스크린샷 2026-08-25 오전 11.13.35.png"  # purple sheet, ai/rain card (used by re-crop pass only)
E = "스크린샷 2026-08-25 오후 1.04.54.png"  # blue sheet, hand/tree cards (used by re-crop pass only)
F = "스크린샷 2026-08-25 오후 1.05.11.png"  # blue sheet, ball card (used by re-crop pass only)

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
    # glue: CARD_BOX_TIGHT is too snug here -- its ring touches the
    # bottle's pale blue-gray body, so border_bg_colors() clusters that
    # body color as a "background" candidate and flood_transparent erases
    # the whole bottle, leaving only the red cap and the "GLUE" label
    # floating (found in the 2026-08 clipping audit, CLAUDE.md). A wider
    # absolute box that keeps the ring in pure white card background fixes
    # it -- see icon_refs/staging/catalog.json history for how this box
    # was derived.
    process_abs(B, (795, 60, 868, 132), "glue")
    process(B, 7, 3, 0, 1, CARD_BOX_TIGHT, "cloud")
    process(C, 4, 6, 5, 3, CORNER_BOX, "fox")

    # 2026-08 clipping-fix pass -- these four (moon/kite/rain/rat) had
    # absolute crop boxes in icon_refs/staging/catalog.json that clipped
    # real artwork (moon's bottom, kite's whole top half, raindrop tips,
    # the rat's tail curl). Re-derived with generous margins by scanning
    # the source sheet's pixels directly (grep CLAUDE.md's clipping-fix
    # notes for the measurement method). moon/rain's wider margins also
    # pull in a nearby caption letter as a second disjoint blob, so those
    # two need keep_largest=True; kite/rat came out clean without it.
    process_abs(A, (373, 262, 475, 356), "moon", keep_largest=True)
    # kite: re-widened again in the 2026-08-25 real-device pass below (see
    # that comment) -- (460, 302, 520, 426) still clipped the left tip.
    process_abs(C, (370, 290, 545, 425), "kite", keep_largest=True)
    # rain: re-widened again below -- (14, 568, 213, 669) still clipped the
    # cloud's rightmost lobe (its content bbox landed exactly on that box's
    # right edge with zero margin, which read as intact at a glance but
    # wasn't -- confirmed by re-deriving from the source sheet).
    process_abs(D2, (10, 560, 222, 672), "rain", keep_largest=True)
    process_abs(C, (240, 610, 361, 712), "rat")

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

    # 2026-08 second clipping-fix pass (chapter 1-8 icon re-audit) -- six
    # more of the original 31 legacy crops (never recorded as process()/
    # process_abs() calls in this file to begin with -- they were produced
    # by an ad hoc one-off pass in commit 6c034cf and only the resulting
    # PNGs + catalog.json cropBox history survived) turned out to clip real
    # artwork once re-measured pixel-by-pixel against the source sheets:
    # cat's ear tips, hand's fingertips, umbrella's finial knob, fork's
    # handle butt, and tree's trunk (box bottom stopped 15px short of where
    # the trunk pixels actually end). ball wasn't clipped but had pulled in
    # a disjoint fragment of the blue "ll" in the "ba(ll)" caption below it
    # as a second blob -- keep_largest drops it. All six re-derived with
    # generous margins the same way as the moon/kite/rain/rat pass above.
    process_abs(C, (373, 36, 549, 143), "cat", keep_largest=True)
    process_abs(E, (90, 55, 225, 135), "hand", keep_largest=True)
    process_abs(C, (0, 745, 183, 858), "umbrella", keep_largest=True)
    process_abs(A, (600, 250, 730, 365), "fork", keep_largest=True)
    process_abs(E, (333, 202, 429, 282), "tree", keep_largest=True)
    process_abs(F, (755, 446, 860, 525), "ball", keep_largest=True)

    # 2026-08-25 real-device clipping pass -- user checked _art.html on the
    # actual iPad and reported eight icons clipped (apple/nose/elephant/fish
    # top, kite/octopus left, rain right, bee bottom); a prior session had
    # re-measured these with alpha-bbox math and wrongly called them fine.
    # Re-derived by hand from the source sheets (grid math for the C-sheet
    # corner-style five, direct pixel scans for elephant/bee/rain's "card"
    # style borders -- see chat history for the scan method), each cross-
    # checked with an actual qlmanage render, not just bbox numbers:
    #   - apple/nose/fish/kite/octopus share sheet C's 4x6 corner grid
    #     (cell = 183x143px). The old boxes were inset far enough from the
    #     cell edge to dodge the grid ruling line but that inset ate into
    #     the artwork (apple's leaf, nose's bridge, fish's dorsal fin,
    #     kite's left tip+top point, octopus's left tentacle tips). Fix:
    #     crop each *full* cell (row*143..row*143+143, col*183..+183) inset
    #     by only 4px -- just enough to clear the ruling line -- then
    #     keep_largest to drop the corner label glyph (Aa/Nn/Ff/Kk/Oo) that
    #     the wider box now also catches.
    #     (An earlier attempt here expanded *outward* past the cell edge
    #     to be extra safe, onto the black ruling line itself. That backfired:
    #     flood_transparent's BFS starts on the crop's outer ring, and the
    #     ruling line's antialiased gray forms an unbroken wall the fill
    #     can't cross, so it only clears a thin band near the edge and
    #     leaves almost the entire cell -- label included -- opaque. Stay
    #     *inside* the ruling line, never on it.)
    #   - elephant/bee/rain are each a different "card" sheet (blue-bordered,
    #     green-bordered, purple-bordered respectively) where the old boxes
    #     simply didn't reach far enough: elephant's box stopped well below
    #     the card's white-interior top (ear clipped), bee's stopped well
    #     above the interior bottom (foot clipped), rain's right edge landed
    #     exactly on the cloud's rightmost lobe with zero margin (content
    #     bbox flush against the box edge reads as "fine" in a bbox-margin
    #     check but is visibly clipped on screen). Fix: re-measured each
    #     card's white-interior rectangle with a pixel scan and used that
    #     (inset a few px from the border) as the box, with keep_largest to
    #     drop the card's letter/caption text.
    process_abs(C, (4, 4, 179, 139), "apple", keep_largest=True)
    process_abs(C, (187, 433, 362, 568), "nose", keep_largest=True)
    process_abs(C, (187, 147, 362, 282), "fish", keep_largest=True)
    process_abs(C, (370, 433, 545, 568), "octopus", keep_largest=True)
    process_abs(F, (628, 206, 736, 356), "elephant", keep_largest=True)
    process_abs(A, (981, 423, 1080, 591), "bee", keep_largest=True)

    # feet: replaces the hand-drawn SVG in src/icons.js (repeatedly buggy --
    # see CLAUDE.md/HANDOFF.md history) with a user-supplied standalone
    # asset (icon_refs/feet_asset.png, a side-profile foot on a flat
    # #f7f7f7 background, not a flashcard sheet) run through the same
    # background-removal pipeline as every other photo icon.
    process_standalone("feet_asset.png", "feet", keep_largest=True)

    # 2026-08-26 8-agent parallel icon-photo batch -- corn/leg/gum/ink/jug/
    # top/mat/ant/snake. Each agent worked from a standalone reference image
    # in icon_refs/ (already a plain illustration on a flat background, not
    # a flashcard grid cell -- same shape as feet_asset.png above) and hand-
    # tuned crop boxes/tolerances to drop non-icon cruft (a caption word, a
    # decorative badge, a photo backdrop) before running the same flood-
    # fill+trim pipeline. Re-derived here from the surviving icon_refs/*.png
    # sources so the pipeline is reproducible; sizes were cross-checked
    # against the agents' original output and match or come within a few px
    # (antialiasing-level noise, not a different crop).
    process_standalone("corn.png", "corn", keep_largest=True, tol=16, pad=6)
    process_standalone("leg.png", "leg", keep_largest=True, tol=20)
    # mat: source has the mat lying on a solid green grass backdrop that
    # touches all four edges -- ordinary border flood-fill strips it in one
    # pass, no crop box needed.
    process_standalone("mat.png", "mat", keep_largest=True, tol=20)
    # ink: bottle + highlighter marker are two disconnected illustration
    # parts -- do NOT use keep_largest here (unlike the others) or it drops
    # the marker as a "stray second blob" the same way it correctly drops a
    # caption glyph elsewhere.
    process_standalone("ink.png", "ink", keep_largest=False, tol=20)
    process_standalone("top.png", "top", keep_largest=True, tol=20)
    # jug: source wraps the jug in a circular badge (navy corners + a thin
    # antialiased ring) that ordinary border flood-fill can't fully clear --
    # the ring's gradient blend is too wide to read as a single background
    # color cluster and survives as a faint circle around the jug. Crop
    # inward past the ring first (box re-derived from a pixel scan of where
    # the ring's antialiasing ends and pure white begins on all four sides),
    # then flood-fill only ever sees clean white outside the jug.
    process_abs("jug.png", (40, 40, 436, 456), "jug", keep_largest=True, tol=20, pad=4)
    # gum: source is a "gum" caption word beside the package art (like a
    # flashcard's caption band, but side-by-side instead of stacked) --
    # crop box starts right after the word ends (scanned the source's
    # middle row for the last content run before the package's purple
    # starts) so only the package survives.
    process_abs("gum.png", (258, 0, 498, 154), "gum", keep_largest=True, tol=20, pad=4)
    # ant: two overlapping ants (maroon + brown) in one flashcard cell, from
    # the 6.54.17 insect-themed sheet's row0/col0 "a" cell. An earlier
    # attempt tried to separate the two ants pixel-by-pixel and produced a
    # mangled red blob (source resolution too low, ~150x115px per cell) --
    # this crops the pair as a single cluster instead (both ants fully
    # intact reads as "ant" fine at icon size) and keep_largest drops the
    # neighboring "a" caption letter, which sits in the same cell.
    process_abs(
        "스크린샷 2026-08-25 오후 6.54.17.png",
        (18, 21, 151, 168),
        "ant",
        keep_largest=True,
        tol=16,
        pad=4,
    )
    # snake: no source sheet survives in icon_refs/ for this one (unlike
    # every other icon above) -- the agent that produced it did not save
    # its reference. public/icons/snake.png is kept as a verbatim final
    # asset (56x71 RGBA, already background-removed and user-verified) with
    # no reproducible process_*() call here. If it ever needs reprocessing,
    # a new source image will have to be sourced first.
