# Persistent data contract

No existing runtime data or source credentials are copied, printed or reset by this port.

| Path | Purpose | Versioned | Deployment implications |
|---|---|---|---|
| `docs/**/*.md` | Canonical documentation, edited by Content Studio | Yes | Git reset/pull may replace tracked edits. GitOps must report unsynchronized changes before publication/deployment. |
| `docs/public/` | Canonical static media | Yes for product assets | Tracked assets can be replaced by Git. Uploads require backup/export; an untracked upload is not deleted by ordinary pull/reset, but must never be subject to git clean. |
| `content/team.json` | Accounts, PBKDF2 hashes, TOTP, permissions | Never | Preserve on VPS; never copy to static output. |
| `content/settings.json`, `content/gitops.json` | Settings and integration credentials | Never | Preserve; GitOps API must redact secrets. |
| `content/audit.json`, `content/api-keys.json` | Audit chain and API key metadata | Never | Preserve; API authorization required. |
| `content/.trash`, `content/.versions` | Deleted docs and revision history | Never | Preserve outside build output. |
| `content/ai-context.json` | Derived public documentation index | Never | Regenerated from final Markdown, no accounts/secrets. |
| `content/search-logs.json`, `content/ai-telemetry.json`, `content/maintenance-subscribers.json` | Analytics and private subscriptions | Never | Preserve; private API only. |
| `data/` | Analytics, DB configuration, sessions, backups, publication state | Never | Preserve; not served statically. |
| `.env*` | Server secrets | Never, except empty `.env.example` | Existing deploy rewrites `.env`; additional variables must be provided before any later deploy. |
| `profile-backgrounds.json` | Legacy profile preferences | Never | Preserve; no build writes. |
| `docs/.vitepress/dist` | Published static artifact | Never | Replaced only after a successful complete build. |

`WF_RUNTIME_DIR` permits an isolated content/data root for local tests. Production defaults retain the existing repository-relative paths. `WF_DOCS_DIR` and `WF_PUBLIC_DIR` are test overrides, not a VPS configuration requirement.

Existing local runtime files observed before migration: `content/team.json`, `content/ai-context.json`, `data/doc_analytics.json`, `data/view-geo-stats.json`. Their contents remain private and untouched. Previous Next recovery was moved outside the repository to `C:/Users/iannc/Desktop/wf-docsold-migration-snapshots/20261003-190907/previous-next-recovery`.
