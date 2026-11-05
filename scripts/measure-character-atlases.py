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
            # A crop may lose padding near a grid cut, never visible content.
            if mask[y0, x0:x1].any() or mask[y1 - 1, x0:x1].any() or mask[y0:y1, x0].any() or mask[y0:y1, x1 - 1].any():
                raise ValueError(f"{path.stem}: crop {row * columns + column} has visible boundary pixels")
            frames.append([x0, y0, x1 - x0, y1 - y0])
    audit = {"rowCuts": row_cuts, "columnCutsByRow": column_cuts, "visibleEdgePixels": edge_counts}
    return {"width": width, "height": height, "frames": frames}, audit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--allow-missing", action="store_true", help="Measure available sheets while generation is in progress")
    args = parser.parse_args()
    output, audits, failures = {}, {}, []
    for family, (columns, rows) in GRIDS.items():
        path = ROOT / "public/art/v2" / f"{family}.png"
        if not path.exists():
            if not args.allow_missing:
                failures.append(f"{family}: missing {path}")
            continue
        try:
            output[family], audits[family] = measure(path, columns, rows)
        except ValueError as error:
            failures.append(str(error))
    print(json.dumps({"measured": list(output), "audits": audits, "failures": failures}, indent=2))
    if failures:
        raise SystemExit(1)
    destination = ROOT / "src/art/atlas-frames.json"
    destination.write_text(json.dumps(output, indent=2) + "\n")


if __name__ == "__main__":
    main()
