"""Regenerate public/assets/ from the source art in assets/.

The two save-the-date graphics have type baked into them, so photography taken
from them is cropped to their text-free regions. The Codex sheets are 2-up
contact sheets, split on the white divider row.

    assets/          source art, hand-managed, never served
    public/assets/   everything below is generated — do not edit by hand

Run from the repo root:

    python3 -m venv .venv && .venv/bin/pip install Pillow
    .venv/bin/python scripts/media.py
"""

import pathlib
import shutil
import subprocess

from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
OUT = ROOT / "public" / "assets"
for sub in ("images", "video", "logos"):
    (OUT / sub).mkdir(parents=True, exist_ok=True)

SAVE_THE_DATE = "photography/save-the-date-1.webp"
WYNWOOD = "photography/save-the-date-2.webp"
SHEET_POOL = "photography/codex-pool.png"
SHEET_WIDE = "photography/codex-terrace.png"

# (source, crop box or None, output stem, widths — first is the base name)
PHOTOS = [
    # Hero. Purpose-built: carries its own cream gradient on the left for type.
    ("photography/hero-terrace.png", None, "hero", [1776, 1280, 900]),
    # Hero, recomposed around the figure for portrait viewports.
    ("photography/hero-terrace.png", (900, 0, 1600, 886), "hero-portrait", [700, 460]),
    # Golden hour over the bay — palms, bamboo and the skyline. Runs at full
    # colour behind the pull-quote, with no wash over it.
    (SHEET_WIDE, (0, 579, 1536, 1024), "terrace", [1536, 960, 640]),
    # The venue itself, from the high-resolution frame: the reflecting pool,
    # bamboo, bougainvillea and the corten gate at dusk. Cropped so the warm
    # building sits under the plate on the left and the planting carries the
    # right. 2158px native, so the panel never upscales it — the earlier
    # 1080px source was being blown up ~1.9x and read soft.
    ("photography/venue-full.png", (760, 180, 2918, 1420), "venue", [1800, 1200, 800]),
]

for name, box, stem, widths in PHOTOS:
    im = Image.open(SRC / name).convert("RGB")
    if box:
        im = im.crop(box)
    for width in widths:
        height = round(im.height * width / im.width)
        suffix = "" if width == widths[0] else f"-{width}"
        path = OUT / "images" / f"{stem}{suffix}.webp"
        # Output sharpening: LANCZOS downsampling always softens a little.
        resized = im.resize((width, height), Image.LANCZOS)
        resized = resized.filter(ImageFilter.UnsharpMask(radius=1.1, percent=58, threshold=3))
        resized.save(path, "WEBP", quality=78, method=6)
        print(f"{path.name:22} {width}x{height}  {path.stat().st_size / 1024:6.1f} KB")

# The wordmark ships as dark green on an opaque cream field. Derive an alpha
# mask from its luminance so it can be tinted for light and dark grounds.
mark = Image.open(SRC / "logos" / "unio-wordmark.png").convert("L").crop((150, 120, 1200, 560)).resize((700, 293), Image.LANCZOS)
alpha = mark.point(lambda v: max(0, min(255, round((231 - v) * 255 / (231 - 95)))))

marks = {}
for name, rgb in [("logo-green", (46, 91, 79)), ("logo-cream", (235, 231, 211))]:
    im = Image.new("RGBA", mark.size, rgb + (0,))
    im.putalpha(alpha)
    marks[name] = im
    path = OUT / "logos" / f"{name}.webp"
    im.save(path, "WEBP", quality=92, method=6, exact=True)
    print(f"{path.name:22} {im.width}x{im.height}  {path.stat().st_size / 1024:6.1f} KB")

# A-List Events supply their wordmark stacked over a script tagline. The hero
# billing takes the wordmark band alone; the footer takes the whole mark,
# tagline included. Alpha is already present in the source, so each is just
# retinted for the ground it sits on.
source = Image.open(SRC / "logos" / "alist-events.webp").convert("RGBA")

for name, box, rgb in [
    ("alist", (55, 0, 498, 82), (10, 12, 10)),        # wordmark, cream ground
    ("alist-full", None, (235, 231, 211)),            # whole mark, black ground
]:
    crop = source.crop(box) if box else source
    im = Image.new("RGBA", crop.size, rgb + (0,))
    im.putalpha(crop.getchannel("A"))
    path = OUT / "logos" / f"{name}.webp"
    im.save(path, "WEBP", quality=92, method=6, exact=True)
    print(f"{path.name:22} {im.width}x{im.height}  {path.stat().st_size / 1024:6.1f} KB")

# Social card: the hero cropped to 1.91:1 with the wordmark set into its
# cream margin. Composited rather than typeset so no font files are needed.
card = Image.open(SRC / "photography" / "hero-terrace.png").convert("RGB").resize((1200, 599), Image.LANCZOS)
card = card.crop((0, 0, 1200, 599)).resize((1200, 630), Image.LANCZOS)
badge = marks["logo-green"].resize((300, 126), Image.LANCZOS)
card.paste(badge, (96, 252), badge)
card.save(OUT / "images" / "og.jpg", "JPEG", quality=86, optimize=True)
print(f"{'og.jpg':22} 1200x630  {(OUT / 'images' / 'og.jpg').stat().st_size / 1024:6.1f} KB")


# --------------------------------------------------------------------- video

# Section I runs an aerial surf loop at the same 4:5 the still occupied.
# The warm grade is baked in rather than applied as a CSS filter: the source is
# a cool turquoise that fights the palette, and grading every frame in the
# compositor costs more than grading once here.
VIDEO_SRC = SRC / "video" / "ocean-aerial.mp4"
GRADE = (
    "crop=576:720:352:0,"
    "colorbalance=rm=0.16:gm=0.05:bm=-0.22:rs=0.08:bs=-0.10:rh=0.12:bh=-0.16,"
    "eq=saturation=0.97:contrast=1.06:gamma=1.04"
)

# Loop length and the crossfade that hides its seam.
LOOP = 16
FADE = 1

# Three rungs, chosen at runtime by connection and pixel density.
# 576x720 is the ceiling, not a choice: the source is 720p, so a 4:5 slice can
# be at most 576 wide. Above that we would be upscaling. The `lo` rung is the
# only one that gives up resolution — the rest is quantiser.
TIERS = [
    ("hi", "576:720", 27),
    ("md", "576:720", 31),
    ("lo", "480:600", 36),
]

if shutil.which("ffmpeg") and VIDEO_SRC.exists():
    src_len = LOOP + FADE
    for tier, scale, crf in TIERS:
        # Forward throughout — an earlier build ran the second half in reverse
        # for a guaranteed seamless loop and the retreating surf read as a
        # glitch. Instead the last second is cross-dissolved into the first, so
        # the water only ever flows one way and the wrap is invisible.
        chain = (
            f"[0:v]{GRADE},fps=24,scale={scale}[v];"
            "[v]split=3[s0][s1][s2];"
            f"[s0]trim=start={LOOP}:end={src_len},setpts=PTS-STARTPTS[tail];"
            f"[s1]trim=start=0:end={FADE},setpts=PTS-STARTPTS[head];"
            f"[s2]trim=start={FADE}:end={LOOP},setpts=PTS-STARTPTS[body];"
            f"[tail][head]xfade=transition=fade:duration={FADE}:offset=0[blend];"
            "[blend][body]concat=n=2:v=1[out]"
        )
        mp4 = OUT / "video" / f"water-{tier}.mp4"
        subprocess.run(
            ["ffmpeg", "-v", "error", "-ss", "8", "-t", str(src_len), "-i", str(VIDEO_SRC),
             "-filter_complex", chain, "-map", "[out]",
             "-c:v", "libx264", "-preset", "veryslow", "-crf", str(crf),
             "-pix_fmt", "yuv420p", "-profile:v", "high", "-an",
             "-movflags", "+faststart", str(mp4), "-y"],
            check=True,
        )
        print(f"{mp4.name:22} {scale.replace(':', 'x')} crf{crf} {LOOP}s  {mp4.stat().st_size / 1024:7.1f} KB")

    # Poster comes off the top rung, and is what stands in whenever the video
    # is never fetched at all. Written via Pillow — not every ffmpeg build
    # ships libwebp.
    frame = OUT / "_frame.png"
    subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(OUT / "video" / "water-hi.mp4"), "-frames:v", "1", str(frame), "-y"],
        check=True,
    )
    poster = OUT / "images" / "water-poster.webp"
    Image.open(frame).convert("RGB").save(poster, "WEBP", quality=80, method=6)
    frame.unlink()
    print(f"{poster.name:22} 576x720            {poster.stat().st_size / 1024:7.1f} KB")
# ---------------------------------------------------------- scroll-scrub hero

# The Higgsfield orbit plays in reverse as the hero opens. Encoding the reverse
# into the files (rather than relying on a negative playbackRate) keeps autoplay
# reliable across browsers, notably Safari.
# The delivered HEVC source needs a broad-compatibility fallback, and the
# reversed site playback requires a fresh encode. The site plays linearly, so
# both outputs use normal two-second web-video GOPs rather than all-intra.
ORBIT_SRC = SRC / "video" / "hf_20260819_004044_838ba99b-3228-4671-95fe-9e49895c88de.mp4"

if shutil.which("ffmpeg") and ORBIT_SRC.exists():
    for tag, codec, crf, extra in [
        ("hevc", "libx265", 17, ["-x265-params", "keyint=48:min-keyint=24:scenecut=40", "-tag:v", "hvc1"]),
        ("h264", "libx264", 18, ["-profile:v", "high", "-g", "48", "-keyint_min", "24"]),
    ]:
        out = OUT / "video" / f"orbit-{tag}.mp4"
        subprocess.run(
            ["ffmpeg", "-v", "error", "-i", str(ORBIT_SRC), "-vf", "reverse",
             "-c:v", codec, "-preset", "slow", "-crf", str(crf),
             "-pix_fmt", "yuv420p", *extra,
             "-an", "-movflags", "+faststart", str(out), "-y"],
            check=True,
        )
        print(f"{out.name:22} 1920x1080 24fps crf{crf}  {out.stat().st_size / 1024:7.1f} KB")

    # Frame 0 of the reversed delivery covers first paint, reduced-motion, and
    # the phone layout, so the hero never flashes from the original opening
    # shot into the reversed film.
    frame = OUT / "_orbit.png"
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(OUT / "video" / "orbit-h264.mp4"), "-frames:v", "1", str(frame), "-y"], check=True)
    still = Image.open(frame).convert("RGB")
    for name, box, widths in [
        ("orbit-poster", None, [1280, 900]),
        # Recomposed around her for portrait viewports, same as the old hero.
        ("orbit-portrait", (560, 0, 1420, 1080), [700, 460]),
    ]:
        crop = still.crop(box) if box else still
        for width in widths:
            height = round(crop.height * width / crop.width)
            suffix = "" if width == widths[0] else f"-{width}"
            path = OUT / "images" / f"{name}{suffix}.webp"
            r = crop.resize((width, height), Image.LANCZOS)
            r = r.filter(ImageFilter.UnsharpMask(radius=1.1, percent=58, threshold=3))
            r.save(path, "WEBP", quality=80, method=6)
            print(f"{path.name:22} {width}x{height}  {path.stat().st_size / 1024:7.1f} KB")
    frame.unlink()


else:
    print("ffmpeg or source video missing — skipped water.mp4")
