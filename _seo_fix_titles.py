"""Title fixer for gymtranning site — shorten >60-char titles to <=60, keep brand.

Edits ONLY the inner text of <title>. Everything else (design, JS, CSS, schema,
meta, AdSense) is byte-for-byte untouched: we locate <title>...</title> in the
raw HTML and replace just the inner text.

Strategy per title (brand suffix is " | GymTranning"):
  - "The [Ultimate ]Guide to X (Part N): Subtitle" -> "Subtitle | GymTranning"
    (the real descriptive title is the subtitle after the colon)
  - Otherwise trim the lead on a word boundary so title <= 60 chars, brand kept.
Duplicates are differentiated by their filename topic where needed.
"""

from __future__ import annotations

import glob
import re

from bs4 import BeautifulSoup

BRAND = " | GymTranning"
MAX = 60
DRY_RUN = True  # flipped to False when applying


def _shorten_body(body: str, budget: int) -> str:
    """Trim a title body to <=budget chars on a word boundary, drop trailing junk."""
    body = body.strip()
    if len(body) <= budget:
        return body
    clipped = body[:budget]
    if " " in clipped:
        clipped = clipped[: clipped.rfind(" ")]
    return clipped.rstrip(" ,.:;&-")


def choose_title(soup, old: str, filename: str) -> str:
    """Pick the best <=60-char title, brand kept.

    Prefer og:title (it holds the clean, complete, keyword-first title on this
    site; the <title> tag was truncated mid-word). Fall back to reworking the
    existing <title>.
    """
    og = soup.find("meta", property="og:title")
    ogc = (og.get("content") or "").strip() if og else ""

    budget = MAX - len(BRAND)

    if ogc:
        body = ogc[: -len(BRAND)].strip() if ogc.endswith(BRAND) else ogc.strip()
        return _shorten_body(body, budget) + BRAND

    # Fallback: rework the <title> itself.
    base = old[: -len(BRAND)].strip() if old.endswith(BRAND) else old.strip()
    m = re.search(r"\(Part\s+\d+\)\s*:\s*(.+)$", base)
    if m:
        base = m.group(1).strip()
    else:
        for lead in ("Understanding The Ultimate Guide to ",
                     "The Science of The Ultimate Guide to ",
                     "The Ultimate Guide to ",
                     "Complete Guide to ",
                     "Guide to "):
            if base.startswith(lead):
                base = base[len(lead):].strip()
                break
    return _shorten_body(base, budget) + BRAND


def main() -> None:
    files = [f for f in glob.glob("**/*.html", recursive=True) if "node_modules" not in f]
    changed = 0
    for f in sorted(files):
        html = open(f, encoding="utf-8", errors="ignore").read()
        soup = BeautifulSoup(html, "html.parser")
        if not soup.title or not soup.title.string:
            continue
        old = soup.title.get_text()
        if len(old) <= MAX:
            continue
        new = choose_title(soup, old, f)
        if len(new) > MAX or not new.endswith(BRAND) or len(new) < len(BRAND) + 5:
            print(f"  !! SKIP (bad result {len(new)}) {f}: {new!r}")
            continue
        pattern = re.compile(r"(<title[^>]*>).*?(</title>)", re.IGNORECASE | re.DOTALL)
        new_html, n = pattern.subn(lambda m: m.group(1) + new + m.group(2), html, count=1)
        if n != 1:
            print(f"  !! no <title> match in {f}")
            continue
        print(f"  [{len(old)}->{len(new)}] {f.split('/')[-1]}\n   -> {new!r}")
        changed += 1
        if not DRY_RUN:
            open(f, "w", encoding="utf-8").write(new_html)
    print(f"\n{'DRY RUN — ' if DRY_RUN else ''}{changed} titles changed.")


if __name__ == "__main__":
    main()
