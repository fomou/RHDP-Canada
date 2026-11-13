#!/usr/bin/env bash
# Wrapper around the Python importer.
#
# IMPORTANT: dry-run is the DEFAULT. Pass --live to create anything on GitHub.
#
#   ./scripts/import-github-project.sh
#   ./scripts/import-github-project.sh --live
#   ./scripts/import-github-project.sh --live --limit 1
#   ./scripts/import-github-project.sh --live --project-url https://github.com/users/fomou/projects/4
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Missing gh (GitHub CLI)." >&2
  exit 1
fi
if ! command -v python3 >/dev/null 2>&1; then
  echo "Missing python3." >&2
  exit 1
fi

exec python3 "${SCRIPT_DIR}/github-project/import_project.py" "$@"
