# AGENTS.md — kurd4crist
Project root: /opt/kurd4crist  ·  Domain: kurd4crist.infragatesolutions.com  ·  tmux: kurd4crist-claude

## Rules
- Work ONLY inside this project (/opt/kurd4crist). Do not touch other projects.
- Do NOT deploy production, edit secrets, delete volumes, or force-push without explicit owner approval.
- End every task by updating docs/SESSION_HANDOFF.md, docs/TASKS.md, docs/COMPLETED.md.
- Before pushing: run tests + show git diff summary.

## Commands (use ops/projectctl)
- ./ops/projectctl status | git | logs | test | handoff | report
- Start: docker compose up -d  ·  Logs: docker compose logs --tail=100

## Docs
CURRENT_STATUS.md · ROADMAP.md · TASKS.md · COMPLETED.md · BLOCKED.md · SESSION_HANDOFF.md · DECISIONS.md
