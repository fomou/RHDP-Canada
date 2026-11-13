# GitHub Project import

Populates [project #4](https://github.com/users/fomou/projects/4) with:

- **5 roadmap epics** (MVP 1–5)
- **22 MVP 1 backlog issues** (`MVP1-01` … `MVP1-22`)
- Labels: `mvp-1`…`mvp-5`, `backend`, `frontend`, `infra`, `priority:P0`, `priority:P1`

Cloud Agents cannot create Issues or Project items (read-only `gh`). Run this **on your machine** with your GitHub account.

## Prerequisites

```bash
gh auth login
# Ensure scopes include: repo, project, read:project
gh auth refresh -s repo,project,read:project
```

## Run

From the repo root:

```bash
chmod +x scripts/import-github-project.sh
./scripts/import-github-project.sh --dry-run
./scripts/import-github-project.sh --project-url https://github.com/users/fomou/projects/4
```

The script is **idempotent for issue titles**: re-running reuses open issues with the same title and tries to add them to the project again.

## Layout

| Path | Role |
| --- | --- |
| `issues.json` | Catalog of titles, labels, body files |
| `bodies/epics/` | MVP 1–5 epic descriptions |
| `bodies/mvp1/` | Fine-grained MVP 1 issue bodies |
| `../import-github-project.sh` | Importer |
