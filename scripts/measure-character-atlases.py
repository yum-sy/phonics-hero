#!/usr/bin/env python3
"""Measure generated atlas alpha without resampling or modifying any image.

Generated sheets are not exactly uniform grids: equal-cell clipping can cut off
horns and boots. Locate empty alpha valleys around the requested grid instead,
then give every visible character a tight rectangle with transparent padding.
Refuse a separating cut through visible pixels rather than hiding lost artwork.
"""

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
GRIDS = {
    "robot": (3, 3),
    "comic": (3, 3),
    "dino": (3, 3),
    "pixel": (3, 3),
    "brick": (3, 3),
    "career": (3, 4),
    "deco": (3, 3),
}
ALPHA_THRESHOLD = 128
PADDING = 4
SEARCH_FRACTION = 0.15


def empty_cut(profile, target, cell_size, context):
    """Choose an empty-run midpoint near a nominal grid boundary."""
    radius = max(1, round(cell_size * SEARCH_FRACTION))
    lo, hi = max(1, round(target) - radius), min(len(profile) - 1, round(target) + radius)
    positions = np.flatnonzero(profile[lo:hi + 1] == 0) + lo
    if not positions.size:
        best = lo + int(np.argmin(profile[lo:hi + 1]))
        raise ValueError(
            f"{context}: no empty separating cut in {lo}..{hi}; "
            f"best cut {best} intersects {int(profile[best])} visible pixels"
        )
    runs = np.split(positions, np.flatnonzero(np.diff(positions) != 1) + 1)
    run = min(runs, key=lambda r: (abs((int(r[0]) + int(r[-1])) / 2 - target), -len(r)))
    return (int(run[0]) + int(run[-1])) // 2


def measure(path, columns, rows):
    alpha = np.asarray(Image.open(path).convert("RGBA"))[:, :, 3]
    mask = alpha > ALPHA_THRESHOLD
    height, width = mask.shape
    edge_counts = [int(mask[0].sum()), int(mask[-1].sum()), int(mask[:, 0].sum()), int(mask[:, -1].sum())]
    if any(edge_counts):
        raise ValueError(f"{path.stem}: source touches outer edge (top,bottom,left,right)={edge_counts}")
    row_cuts = [0] + [
        empty_cut(mask.sum(axis=1), height * i / rows, height / rows, f"{path.stem} row {i}")
        for i in range(1, rows)
    ] + [height]
    frames = []
    column_cuts = []
    shared_empty_padding = []
    for row in range(rows):
        top, bottom = row_cuts[row:row + 2]
        profile = mask[top:bottom].sum(axis=0)
        cuts = [0] + [
            empty_cut(profile, width * i / columns, width / columns, f"{path.stem} row {row} column {i}")
            for i in range(1, columns)
        ] + [width]
        column_cuts.append(cuts)
        for column in range(columns):
            left, right = cuts[column:column + 2]
            ys, xs = np.nonzero(mask[top:bottom, left:right])
            if not len(xs):
                raise ValueError(f"{path.stem}: empty character cell {row * columns + column}")
            x0 = max(left, left + int(xs.min()) - PADDING)
            y0 = max(top, top + int(ys.min()) - PADDING)
            x1 = min(right, left + int(xs.max()) + 1 + PADDING)
            y1 = min(bottom, top + int(ys.max()) + 1 + PADDING)
            # A one-pixel empty valley cannot be split into two exclusive
            # transparent borders. Both crops may own that same proven-empty
            # line; their rectangles overlap, but their visible pixels never do.
            shared = []
            if x1 == right and right < width and mask[y0:y1, x1 - 1].any():
                if mask[top:bottom, right].any():
                    raise ValueError(f"{path.stem}: nonempty shared vertical cut {right}")
                x1 += 1
                shared.append("right")
            if y1 == bottom and bottom < height and mask[y1 - 1, x0:x1].any():
                if mask[bottom].any():
                    raise ValueError(f"{path.stem}: nonempty shared horizontal cut {bottom}")
                y1 += 1
                shared.append("bottom")
            if shared:
                shared_empty_padding.append({"slot": row * columns + column, "edges": shared})
            # A crop may lose padding near a grid cut, never visible content.
            if mask[y0, x0:x1].any() or mask[y1 - 1, x0:x1].any() or mask[y0:y1, x0].any() or mask[y0:y1, x1 - 1].any():
                raise ValueError(f"{path.stem}: crop {row * columns + column} has visible boundary pixels")
            frames.append([x0, y0, x1 - x0, y1 - y0])
    coverage = np.zeros(mask.shape, dtype=np.uint8)
    for x, y, frame_width, frame_height in frames:
        coverage[y:y + frame_height, x:x + frame_width] += 1
    omitted = int((mask & (coverage == 0)).sum())
    duplicated = int((mask & (coverage > 1)).sum())
    if omitted or duplicated:
        raise ValueError(f"{path.stem}: visible pixels omitted={omitted}, duplicated={duplicated}")
    audit = {
        "rowCuts": row_cuts,
        "columnCutsByRow": column_cuts,
        "visibleEdgePixels": edge_counts,
        "sharedEmptyPadding": shared_empty_padding,
        "omittedVisiblePixels": omitted,
        "duplicatedVisiblePixels": duplicated,
    }
    return {"width": width, "height": height, "frames": frames}, audit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--allow-missing", action="store_true", help="Measure available sheets while generation is in progress")
    parser.add_argument("--worlds", action="store_true", help="Measure public/art/v3/*-worlds.png as 5-column x 2-row world sheets")
    parser.add_argument("--refresh", action="store_true", help="Measure the four dinosaur/animal-knight replacement sheets in public/art/v4")
    args = parser.parse_args()
    output, audits, failures = {}, {}, []
    grids = {f"{family}-worlds": (5, 2) for family in GRIDS} if args.worlds else GRIDS
    source_dir = ROOT / ("public/art/v3" if args.worlds else "public/art/v2")
    if args.refresh:
        grids = {"dino": (3, 3), "brick": (3, 3), "dino-worlds": (5, 2), "brick-worlds": (5, 2)}
        source_dir = ROOT / "public/art/v4"
    for family, (columns, rows) in grids.items():
        path = source_dir / f"{family}.png"
        if not path.exists():
            if not args.allow_missing:
                failures.append(f"{family}: missing {path}")
            continue
        try:
            output[family], audits[family] = measure(path, columns, rows)
            if args.refresh:
                output[family]["path"] = f"v4/{family}.png"
        except ValueError as error:
            failures.append(str(error))
    print(json.dumps({"measured": list(output), "audits": audits, "failures": failures}, indent=2))
    if failures:
        raise SystemExit(1)
    destination = ROOT / ("src/art/world-atlas-frames.json" if args.worlds else "src/art/atlas-frames.json")
    if args.refresh:
        destination = ROOT / "src/art/refresh-atlas-frames.json"
    destination.write_text(json.dumps(output, indent=2) + "\n")


if __name__ == "__main__":
    main()
