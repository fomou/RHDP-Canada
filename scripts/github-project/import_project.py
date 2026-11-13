#!/usr/bin/env python3
"""Import RHDP roadmap + MVP1 backlog into a GitHub repo and Project v2.

Uses `gh api` (REST + GraphQL) so failures surface clearly. Run with YOUR login:

  gh auth refresh -s repo,project,read:project
  python3 scripts/github-project/import_project.py --live
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = Path(__file__).resolve().parent
CATALOG = DATA_DIR / "issues.json"

LABELS = [
    ("mvp-1", "0E8A16", "MVP 1 identity and onboarding"),
    ("mvp-2", "1D76DB", "MVP 2 membership and Stripe checkout"),
    ("mvp-3", "5319E7", "MVP 3 family and communications"),
    ("mvp-4", "D93F0B", "MVP 4 events and contributions"),
    ("mvp-5", "B60205", "MVP 5 admin ops and hardening"),
    ("backend", "0052CC", "Backend / API work"),
    ("frontend", "5319E7", "Frontend / Next.js work"),
    ("infra", "BFDADC", "Infrastructure and migrations"),
    ("priority:P0", "D73A4A", "Must ship for the MVP exit criteria"),
    ("priority:P1", "FBCA04", "Important but not blocking the MVP spine"),
]


class GhError(RuntimeError):
    pass


def gh(args: list[str], *, input_text: str | None = None) -> str:
    proc = subprocess.run(
        ["gh", *args],
        input=input_text,
        text=True,
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        raise GhError(
            f"gh {' '.join(args)} failed ({proc.returncode})\n"
            f"stdout:\n{proc.stdout}\nstderr:\n{proc.stderr}"
        )
    return proc.stdout.strip()


def gh_json(args: list[str], *, input_text: str | None = None):
    out = gh(args, input_text=input_text)
    return json.loads(out) if out else None


def parse_project_url(url: str) -> tuple[str, int, str]:
    # returns owner, number, owner_type (user|organization)
    # https://github.com/users/fomou/projects/4
    # https://github.com/orgs/acme/projects/4
    parts = url.rstrip("/").split("/")
    try:
        projects_idx = parts.index("projects")
        number = int(parts[projects_idx + 1])
        owner = parts[projects_idx - 1]
        kind = parts[projects_idx - 2]
    except (ValueError, IndexError) as exc:
        raise SystemExit(f"Unrecognized project URL: {url}") from exc
    if kind == "users":
        return owner, number, "user"
    if kind == "orgs":
        return owner, number, "organization"
    raise SystemExit(f"Unrecognized project URL: {url}")


def ensure_label(repo: str, name: str, color: str, description: str, live: bool) -> None:
    # 404 is expected for missing labels.
    proc = subprocess.run(
        ["gh", "api", f"repos/{repo}/labels/{name}"],
        capture_output=True,
        text=True,
        check=False,
    )
    if proc.returncode == 0:
        print(f"  label exists: {name}")
        return
    if not live:
        print(f"  [dry-run] create label: {name}")
        return
    payload = {"name": name, "color": color, "description": description}
    gh(
        ["api", f"repos/{repo}/labels", "--method", "POST", "--input", "-"],
        input_text=json.dumps(payload),
    )
    print(f"  label created: {name}")


def list_open_issues_by_title(repo: str) -> dict[str, int]:
    # Paginate via gh api
    result: dict[str, int] = {}
    page = 1
    while True:
        items = gh_json(
            [
                "api",
                f"repos/{repo}/issues?state=open&per_page=100&page={page}",
            ]
        )
        if not items:
            break
        for item in items:
            if "pull_request" in item:
                continue
            result[item["title"]] = item["number"]
        if len(items) < 100:
            break
        page += 1
    return result


def create_issue(repo: str, title: str, body: str, labels: list[str], live: bool) -> dict:
    if not live:
        print(f"  [dry-run] would create: {title}")
        return {"html_url": f"dry-run://{title}", "number": 0, "node_id": ""}
    payload = {"title": title, "body": body, "labels": labels}
    created = gh_json(
        ["api", f"repos/{repo}/issues", "--method", "POST", "--input", "-"],
        input_text=json.dumps(payload),
    )
    if not created or not created.get("html_url") or not created.get("number"):
        raise GhError(f"Issue create returned unexpected payload: {created}")
    # Verify readable
    verified = gh_json(["api", f"repos/{repo}/issues/{created['number']}"])
    if not verified or verified.get("title") != title:
        raise GhError(
            f"Created issue #{created.get('number')} but verify failed: {verified}"
        )
    print(f"  created #{created['number']}: {created['html_url']}")
    return created


def resolve_project_id(owner: str, number: int, owner_type: str) -> str:
    if owner_type == "user":
        query = """
        query($login:String!, $number:Int!) {
          user(login:$login) { projectV2(number:$number) { id title url } }
        }
        """
        data = gh_json(
            [
                "api",
                "graphql",
                "-f",
                f"query={query}",
                "-F",
                f"login={owner}",
                "-F",
                f"number={number}",
            ]
        )
        project = data["data"]["user"]["projectV2"]
    else:
        query = """
        query($login:String!, $number:Int!) {
          organization(login:$login) { projectV2(number:$number) { id title url } }
        }
        """
        data = gh_json(
            [
                "api",
                "graphql",
                "-f",
                f"query={query}",
                "-F",
                f"login={owner}",
                "-F",
                f"number={number}",
            ]
        )
        project = data["data"]["organization"]["projectV2"]
    if not project:
        raise GhError(
            f"Could not resolve Project #{number} for {owner_type} {owner}. "
            "Check the URL and that your token has read:project / project scopes."
        )
    print(f"  project: {project['title']} ({project['url']})")
    return project["id"]


def add_project_item(project_id: str, content_node_id: str, live: bool) -> None:
    if not live:
        print("  [dry-run] project add skipped")
        return
    if not content_node_id:
        print("  project add skipped (no node id)")
        return
    mutation = """
    mutation($projectId:ID!, $contentId:ID!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
        item { id }
      }
    }
    """
    try:
        gh_json(
            [
                "api",
                "graphql",
                "-f",
                f"query={mutation}",
                "-f",
                f"projectId={project_id}",
                "-f",
                f"contentId={content_node_id}",
            ]
        )
        print("  added to project")
    except GhError as exc:
        # Duplicate item often returns an error; keep going.
        print(f"  project add warning: {exc}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--project-url",
        default="https://github.com/users/fomou/projects/4",
    )
    parser.add_argument("--repo", default="fomou/RHDP-Canada")
    parser.add_argument(
        "--live",
        action="store_true",
        help="Actually create labels/issues/project items. Without this flag, dry-run only.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Only process the first N catalog entries (0 = all).",
    )
    args = parser.parse_args()
    live = bool(args.live)

    if not CATALOG.is_file():
        print(f"Missing catalog: {CATALOG}", file=sys.stderr)
        return 1

    login = "(unauthenticated)"
    try:
        login = gh(["api", "user", "--jq", ".login"])
    except GhError as exc:
        if live:
            print(exc, file=sys.stderr)
            print(
                "Run: gh auth login && gh auth refresh -s repo,project,read:project",
                file=sys.stderr,
            )
            return 1
        print("Warning: gh auth not usable; continuing dry-run only.")

    owner, number, owner_type = parse_project_url(args.project_url)
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    if args.limit and args.limit > 0:
        catalog = catalog[: args.limit]

    print(f"Auth as: {login}")
    print(f"Repo:    {args.repo}")
    print(f"Project: {args.project_url}")
    print(f"Mode:    {'LIVE' if live else 'DRY-RUN (pass --live to create)'}")
    print(f"Queued:  {len(catalog)} issues")
    if not live:
        print("\n*** DRY-RUN: nothing will be created on GitHub ***\n")

    print("\n== Labels ==")
    for name, color, description in LABELS:
        try:
            ensure_label(args.repo, name, color, description, live)
        except GhError as exc:
            print(exc, file=sys.stderr)
            return 1

    project_id = None
    if live:
        print("\n== Resolve project ==")
        try:
            project_id = resolve_project_id(owner, number, owner_type)
        except GhError as exc:
            print(exc, file=sys.stderr)
            return 1

    print("\n== Issues ==")
    existing = list_open_issues_by_title(args.repo) if live else {}
    created = 0
    reused = 0

    for item in catalog:
        issue_id = item["id"]
        title = item["title"]
        body_path = DATA_DIR / item["body"]
        labels = item["labels"]
        print(f"\n-- {issue_id}")
        if not body_path.is_file():
            print(f"Missing body: {body_path}", file=sys.stderr)
            return 1
        body = body_path.read_text(encoding="utf-8")

        if title in existing:
            number_existing = existing[title]
            issue = gh_json(["api", f"repos/{args.repo}/issues/{number_existing}"])
            print(f"  reuse #{number_existing}: {issue['html_url']}")
            reused += 1
        else:
            try:
                issue = create_issue(args.repo, title, body, labels, live)
            except GhError as exc:
                print(exc, file=sys.stderr)
                return 1
            created += 1
            if live and issue.get("number"):
                existing[title] = issue["number"]

        if live and project_id:
            add_project_item(project_id, issue.get("node_id", ""), live)
        elif not live:
            print("  [dry-run] project add skipped")

    print(f"\nDone. created={created} reused={reused}")
    if live:
        total = gh(
            [
                "api",
                f"search/issues?q=repo:{args.repo}+is:issue+is:open",
                "--jq",
                ".total_count",
            ]
        )
        print(f"Verify: open issues in {args.repo} = {total}")
        print(f"Board:  {args.project_url}")
        if int(total) == 0:
            print(
                "ERROR: GitHub still reports 0 open issues after LIVE run.",
                file=sys.stderr,
            )
            return 1
    else:
        print("Dry-run finished. Re-run with --live to create.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
