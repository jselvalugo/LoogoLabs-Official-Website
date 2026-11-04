"""Package each marketplace skill folder as a downloadable .zip.

marketplace/skills/<name>/  ->  public/skills/<name>.zip  (zip contains <name>/SKILL.md,
the layout Claude's "Upload skill" expects). Re-run after editing a skill:
    python3 scripts/build-skill-zips.py
"""
import pathlib, zipfile

root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'marketplace' / 'skills'
out = root / 'public' / 'skills'
out.mkdir(parents=True, exist_ok=True)
for d in sorted(p for p in src.iterdir() if p.is_dir()):
    z = out / f'{d.name}.zip'
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        for f in sorted(d.rglob('*')):
            if f.is_file():
                info = zipfile.ZipInfo(str(pathlib.Path(d.name) / f.relative_to(d)), date_time=(2026, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                zf.writestr(info, f.read_bytes())
    print(z.relative_to(root), z.stat().st_size, 'bytes')
