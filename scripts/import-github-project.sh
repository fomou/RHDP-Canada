#!/usr/bin/env bash
# Import RHDP Canada roadmap + MVP 1 backlog into a GitHub Project (v2).
#
# Requires YOUR GitHub credentials (Cloud Agents cannot write Issues/Projects):
#   gh auth login
#   # scopes: repo, project, read:project
#
# Usage:
#   ./scripts/import-github-project.sh
#   ./scripts/import-github-project.sh --project-url https://github.com/users/fomou/projects/4
#   ./scripts/import-github-project.sh --dry-run
#
set -euo pipefail

REPO="${REPO:-fomou/RHDP-Canada}"
PROJECT_OWNER="${PROJECT_OWNER:-fomou}"
PROJECT_NUMBER="${PROJECT_NUMBER:-4}"
PROJECT_URL="https://github.com/users/${PROJECT_OWNER}/projects/${PROJECT_NUMBER}"
DRY_RUN=0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DATA_DIR="${SCRIPT_DIR}/github-project"
ISSUES_JSON="${DATA_DIR}/issues.json"
WORK_LIST="${DATA_DIR}/.work-list.tsv"

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --project-url URL   User or org project URL (default: ${PROJECT_URL})
  --repo OWNER/NAME   Repository for issues (default: ${REPO})
  --dry-run           Print actions without creating labels/issues/items
  -h, --help          Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project-url)
      PROJECT_URL="$2"
      if [[ "${PROJECT_URL}" =~ github.com/users/([^/]+)/projects/([0-9]+) ]]; then
        PROJECT_OWNER="${BASH_REMATCH[1]}"
        PROJECT_NUMBER="${BASH_REMATCH[2]}"
      elif [[ "${PROJECT_URL}" =~ github.com/orgs/([^/]+)/projects/([0-9]+) ]]; then
        PROJECT_OWNER="${BASH_REMATCH[1]}"
        PROJECT_NUMBER="${BASH_REMATCH[2]}"
      else
        echo "Unrecognized project URL: ${PROJECT_URL}" >&2
        exit 1
      fi
      shift 2
      ;;
    --repo)
      REPO="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

need_cmd gh
need_cmd python3
need_cmd jq

if [[ ! -f "${ISSUES_JSON}" ]]; then
  echo "Missing catalog: ${ISSUES_JSON}" >&2
  exit 1
fi

cd "${REPO_ROOT}"

if [[ "${DRY_RUN}" -eq 0 ]]; then
  if ! gh auth status >/dev/null 2>&1; then
    echo "Not authenticated. Run: gh auth login  (scopes: repo, project, read:project)" >&2
    exit 1
  fi
fi

echo "Repo:    ${REPO}"
echo "Project: ${PROJECT_URL} (owner=${PROJECT_OWNER} number=${PROJECT_NUMBER})"
echo "Catalog: ${ISSUES_JSON}"
[[ "${DRY_RUN}" -eq 1 ]] && echo "Mode:    dry-run"

# name|color|description  (pipe-separated so names may contain ':')
LABELS=(
  "mvp-1|0E8A16|MVP 1 identity and onboarding"
  "mvp-2|1D76DB|MVP 2 membership and Stripe checkout"
  "mvp-3|5319E7|MVP 3 family and communications"
  "mvp-4|D93F0B|MVP 4 events and contributions"
  "mvp-5|B60205|MVP 5 admin ops and hardening"
  "backend|0052CC|Backend / API work"
  "frontend|5319E7|Frontend / Next.js work"
  "infra|BFDADC|Infrastructure and migrations"
  "priority:P0|D73A4A|Must ship for the MVP exit criteria"
  "priority:P1|FBCA04|Important but not blocking the MVP spine"
)

ensure_label() {
  local name="$1" color="$2" description="$3"
  if [[ "${DRY_RUN}" -eq 1 ]]; then
    echo "  [dry-run] ensure label: ${name}"
    return 0
  fi
  if gh label list --repo "${REPO}" --json name --jq '.[].name' 2>/dev/null | grep -Fxq "${name}"; then
    echo "  label exists: ${name}"
    return 0
  fi
  if ! gh label create "${name}" --repo "${REPO}" --color "${color}" --description "${description}" 2>/dev/null; then
    gh label edit "${name}" --repo "${REPO}" --color "${color}" --description "${description}" >/dev/null
  fi
  echo "  label ready: ${name}"
}

echo ""
echo "== Labels =="
for entry in "${LABELS[@]}"; do
  IFS='|' read -r name color description <<<"${entry}"
  ensure_label "${name}" "${color}" "${description}"
done

find_issue_by_title() {
  local title="$1"
  gh issue list --repo "${REPO}" --state open --limit 200 --json number,title \
    --jq --arg t "${title}" '.[] | select(.title == $t) | .number' | head -n1
}

add_to_project() {
  local issue_url="$1"
  if [[ "${issue_url}" == dry-run://* ]]; then
    echo "  [dry-run] project item-add skipped"
    return 0
  fi
  if [[ "${DRY_RUN}" -eq 1 ]]; then
    echo "  [dry-run] project item-add ${issue_url}"
    return 0
  fi
  if gh project item-add "${PROJECT_NUMBER}" --owner "${PROJECT_OWNER}" --url "${issue_url}" >/dev/null 2>&1; then
    echo "  added to project"
  else
    echo "  project add skipped (already present or missing 'project' scope)"
    echo "    retry: gh project item-add ${PROJECT_NUMBER} --owner ${PROJECT_OWNER} --url ${issue_url}"
  fi
}

python3 - <<PY
import json
from pathlib import Path
data = json.loads(Path("${ISSUES_JSON}").read_text())
lines = []
for item in data:
    labels = ",".join(item["labels"])
    lines.append("\t".join([item["id"], item["title"], item["body"], labels]))
Path("${WORK_LIST}").write_text("\n".join(lines) + "\n")
print(f"queued {len(lines)} issues")
PY

echo ""
echo "== Issues =="

CREATED=0
REUSED=0

while IFS=$'\t' read -r issue_id title body_rel labels_csv; do
  [[ -z "${issue_id}" ]] && continue
  body_file="${DATA_DIR}/${body_rel}"
  if [[ ! -f "${body_file}" ]]; then
    echo "Missing body file for ${issue_id}: ${body_file}" >&2
    exit 1
  fi

  echo ""
  echo "-- ${issue_id}"
  IFS=',' read -r -a label_arr <<<"${labels_csv}"

  existing=""
  if [[ "${DRY_RUN}" -eq 0 ]]; then
    existing="$(find_issue_by_title "${title}" || true)"
  fi

  if [[ -n "${existing}" ]]; then
    issue_url="https://github.com/${REPO}/issues/${existing}"
    echo "  reuse #${existing}"
    REUSED=$((REUSED + 1))
  elif [[ "${DRY_RUN}" -eq 1 ]]; then
    echo "  [dry-run] would create: ${title}"
    echo "  labels: ${labels_csv}"
    issue_url="dry-run://${issue_id}"
    CREATED=$((CREATED + 1))
  else
    label_args=()
    for label in "${label_arr[@]}"; do
      label_args+=(--label "${label}")
    done
    issue_url="$(gh issue create --repo "${REPO}" --title "${title}" --body-file "${body_file}" "${label_args[@]}")"
    echo "  created ${issue_url}"
    CREATED=$((CREATED + 1))
  fi

  add_to_project "${issue_url}"
done < "${WORK_LIST}"

rm -f "${WORK_LIST}"

echo ""
echo "Done. created=${CREATED} reused=${REUSED}"
echo "Open the board: ${PROJECT_URL}"
echo ""
echo "If project item-add failed, refresh scopes then re-run (idempotent for existing titles):"
echo "  gh auth refresh -s repo,project,read:project"
echo "  ./scripts/import-github-project.sh --project-url ${PROJECT_URL}"
