# Simple script to scan image subfolders and write index.json with filenames
import os
import json

# adjust these relative folder paths (relative to project root)
folders = [
    "img/Diffuser (8)-20251209T043833Z-3-001",
    "img/Infus (10)-20251209T043831Z-3-001/Infus (10)",
    "img/Injeksi-20251209T043404Z-3-001",
    "img/Nasal Spray (5)-20251209T052342Z-3-001",
    "img/Obat tetes-20251209T043807Z-3-001",
    "img/Sale[",  # keep the literal folder name you mentioned
    "img/Sirup-20251209T022312Z-3-001",
    "img/Tablet"
]

exts = {'.png','.jpg','.jpeg','.webp','.gif'}

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # project root
print("Project root:", root)

for rel in folders:
    folder = os.path.join(root, rel)
    if not os.path.isdir(folder):
        print("Skip (not found):", rel)
        continue
    files = []
    for f in sorted(os.listdir(folder)):
        if os.path.splitext(f)[1].lower() in exts:
            files.append(f)
    if not files:
        print("No images found in", rel)
        continue
    out = os.path.join(folder, 'index.json')
    # write array of filenames (loader accepts array of strings)
    with open(out, 'w', encoding='utf-8') as fh:
        json.dump(files, fh, ensure_ascii=False, indent=2)
    print("Wrote", out, "(", len(files), "entries )")
