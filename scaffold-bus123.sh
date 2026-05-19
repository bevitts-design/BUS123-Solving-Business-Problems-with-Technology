#!/bin/bash
# BUS123 GitHub Repo Scaffold
# Run from the root of your cloned bevitts-design/BUS123 repo
# Usage: bash scaffold-bus123.sh

set -e

TRACKS=("intro" "excel" "math")

echo "Scaffolding BUS123 public repo structure..."

for track in "${TRACKS[@]}"; do
  for m in 01 02 03 04 05 06 07 08 09 10; do
    dir="public/${track}/${track}-m${m}"
    mkdir -p "$dir"
    touch "$dir/.gitkeep"
  done
done

mkdir -p shared
touch shared/.gitkeep

echo "Public repo folders created."

# Root README
cat > README.md << 'READMEEOF'
# BUS123 — Solving Business Problems with Technology
**Gerrish School of Business · Endicott College · Fall 2026**

Student-facing materials for BUS 123. All files are organized by track and module.

## Tracks
| Track | Description |
|-------|-------------|
| `intro` | Technology & Collaboration modules |
| `excel` | Excel Skills modules |
| `math` | Business Math modules |

## File Naming
All files follow the convention: `bus123-[track]-m[nn]-l[nn]-[type].[ext]`

## Shared Resources
Cross-module reference materials are in `/shared`.
READMEEOF

echo "README.md written."
echo ""
echo "Done. Next steps:"
echo "  git add ."
echo "  git commit -m 'scaffold: module-based folder structure'"
echo "  git push"
