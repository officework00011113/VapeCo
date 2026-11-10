"""Package the complete static website, its source, and audit documentation."""
from pathlib import Path
import argparse
import zipfile

root = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path,
                    default=root.parent / 'VapeCo-Technical-Fixes-Audit.zip')
args = parser.parse_args()
output = args.output.resolve()
output.parent.mkdir(parents=True, exist_ok=True)

files = [
    file for file in sorted(root.rglob('*'))
    if file.is_file()
    and '__pycache__' not in file.parts
    and file.suffix not in {'.pyc', '.pyo', '.zip'}
    and file.resolve() != output
]
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in files:
        archive.write(file, Path(root.name) / file.relative_to(root))
print(f'Packaged {len(files)} files: {output}')
