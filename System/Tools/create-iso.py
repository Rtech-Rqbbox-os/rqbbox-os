#!/usr/bin/env python3
"""Create a Data ISO (UDF+Joliet) of RQBBOX OS files."""
import os, pycdlib, re
from pathlib import Path

SRC = Path(r"H:\RQBBOX_OS")
OUT = SRC.parent / "RQBBOX_OS.iso"
VOLUME_LABEL = "RQBBOX_0_AI_USB"
EXCLUDE = {".git", ".github", "__pycache__", "node_modules",
           ".gitignore", ".gitattributes", ".nojekyll"}

def sanitize(name):
    """ISO9660: only A-Z, 0-9, _. Last dot is separator. Max 31 chars."""
    s = re.sub(r'[^A-Z0-9_.]', '_', name.upper())
    # Only keep the last dot; replace all others with underscore
    parts = s.rsplit('.', 1)
    name_part = re.sub(r'[^A-Z0-9_]', '_', parts[0])
    ext_part = parts[1][:3] if len(parts) > 1 else ''
    s = f"{name_part[:27]}.{ext_part}" if ext_part else name_part[:31]
    s = s.strip('.') or "FILE"
    return s

def add_tree(iso, src_dir, iso_path, joliet_path, udf_path):
    for entry in sorted(src_dir.iterdir()):
        name = entry.name
        if name in EXCLUDE or name.startswith("."):
            continue
        iso_rel = f"{iso_path}/{sanitize(name)}"
        joliet_rel = f"{joliet_path}/{name}"
        udf_rel = f"{udf_path}/{name}"
        if entry.is_dir():
            iso.add_directory(iso_rel, joliet_path=joliet_rel, udf_path=udf_rel)
            add_tree(iso, entry, iso_rel, joliet_rel, udf_rel)
        else:
            iso.add_file(str(entry), iso_rel, joliet_path=joliet_rel, udf_path=udf_rel)

def main():
    iso = pycdlib.PyCdlib()
    # UDF supports unlimited filename length and any characters
    iso.new(interchange_level=3, joliet=True, udf="2.60")
    iso.add_directory("/RQBBOX_OS", joliet_path="/RQBBOX_OS", udf_path="/RQBBOX_OS")
    add_tree(iso, SRC, "/RQBBOX_OS", "/RQBBOX_OS", "/RQBBOX_OS")
    iso.write(str(OUT))
    iso.close()
    size_mb = os.path.getsize(OUT) / (1024 * 1024)
    print(f"Created: {OUT}")
    print(f"Size:    {size_mb:.1f} MB")
    print(f"Label:   {VOLUME_LABEL}")

if __name__ == "__main__":
    main()
