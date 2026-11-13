# GitHub Project import

Populates [project #4](https://github.com/users/fomou/projects/4) with:

- **5 roadmap epics** (MVP 1–5)
- **22 MVP 1 backlog issues** (`MVP1-01` … `MVP1-22`)
- Labels: `mvp-1`…`mvp-5`, `backend`, `frontend`, `infra`, `priority:P0`, `priority:P1`

## Important

**Dry-run is the default.** Nothing is created unless you pass `--live`.

Cloud Agents cannot create Issues/Projects. Run this on your machine with your GitHub account.

## Prerequisites

```bash
gh auth login
gh auth refresh -s repo,project,read:project
gh api user --jq .login    # should print your username, e.g. fomou
```

## Run

From the repo root (after `git pull`):

```bash
# Preview only (default)
./scripts/import-github-project.sh --project-url https://github.com/users/fomou/projects/4

# Smoke-test: create only the first catalog item
./scripts/import-github-project.sh --live --limit 1

# Full import
./scripts/import-github-project.sh --live --project-url https://github.com/users/fomou/projects/4
```

You should see lines like `created #N: https://github.com/fomou/RHDP-Canada/issues/N` and a final `Verify: open issues … = 27`.

Idempotent for open issue titles: re-running reuses existing issues and retries project membership.

## Layout

| Path | Role |
| --- | --- |
| `import_project.py` | Importer (`gh api` REST + GraphQL) |
| `issues.json` | Catalog of titles, labels, body files |
| `bodies/epics/` | MVP 1–5 epic descriptions |
| `bodies/mvp1/` | Fine-grained MVP 1 issue bodies |
| `../import-github-project.sh` | Thin wrapper |
