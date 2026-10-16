"""Draws the app icons (public/icons/*.png) from the logo geometry of UI-SPEC.md section 11.

The mark is three token chips, the last one filled mint, on the pale-mint background. The maskable
icon keeps the mark inside the central 80 percent so any mask shape leaves it whole.

Usage (needs PyMuPDF, which renders SVG): python -I scripts/make-icons.py
"""

import pathlib

import pymupdf

MINT_BG = "#ecffe0"  # canvas-mint
INK = "#000000"  # ink
PRIMARY = "#00f0a0"  # primary

# name: (pixel size, share of the width taken by the three chips)
ICONS = {
    "icon-192": (192, 0.62),
    "icon-512": (512, 0.62),
    "icon-maskable-512": (512, 0.48),  # inside the 80 percent safe zone
    "apple-touch-icon": (180, 0.62),
}

# Chip geometry on the 32 x 32 logo grid; the chips span x 2 to 30.
CHIPS = [(2, 8, "none"), (12, 6, "none"), (20, 10, PRIMARY)]
SPAN = 28
CENTER = 16


def rounded(x: float, y: float, w: float, h: float, r: float, fill: str) -> str:
    """A rounded rectangle as a path with true arcs (the renderer approximates `rx` coarsely)."""
    d = (
        f"M{x + r} {y}H{x + w - r}A{r} {r} 0 0 1 {x + w} {y + r}V{y + h - r}"
        f"A{r} {r} 0 0 1 {x + w - r} {y + h}H{x + r}A{r} {r} 0 0 1 {x} {y + h - r}"
        f"V{y + r}A{r} {r} 0 0 1 {x + r} {y}Z"
    )
    return f'<path d="{d}" fill="{fill}"/>'


def svg(size: int, share: float) -> str:
    scale = size * share / SPAN
    shift = size / 2 - CENTER * scale
    rects = "".join(rounded(x, 11, w, 10, 3, fill) for x, w, fill in CHIPS)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">'
        f'<rect width="{size}" height="{size}" fill="{MINT_BG}"/>'
        f'<g transform="translate({shift} {shift}) scale({scale})" stroke="{INK}" stroke-width="2">{rects}</g>'
        "</svg>"
    )


def main() -> None:
    out = pathlib.Path(__file__).resolve().parent.parent / "public" / "icons"
    out.mkdir(parents=True, exist_ok=True)
    for name, (size, share) in ICONS.items():
        doc = pymupdf.open(stream=svg(size, share).encode("utf-8"), filetype="svg")
        pixmap = doc[0].get_pixmap(matrix=pymupdf.Matrix(1, 1), alpha=False)
        path = out / f"{name}.png"
        pixmap.save(path)
        print(f"{path.name}: {pixmap.width}x{pixmap.height}")


if __name__ == "__main__":
    main()
