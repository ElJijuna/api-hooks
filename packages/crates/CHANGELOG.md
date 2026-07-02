## 1.0.0 (2026-07-02)

### ⚠ BREAKING CHANGES

* the `token` option has been removed from all hooks. Configure
authentication once via GhClientProvider at the app root instead.

- Add GhClientProvider and useGhClient() context following the NpmClientContext pattern
- Refactor all 99 hooks to use useGhClient() instead of per-hook token+useMemo
- Add useGhNotifications and useGhNotificationsInfinite
- Add useGhMarkNotificationRead and useGhMarkAllNotificationsRead mutations
- Add useGhIssues and useGhIssuesInfinite (cross-repository, GET /issues)
- Add useGhSearchIssues and useGhSearchIssuesInfinite
- Add useGhRepoWorkflowRuns and useGhRepoWorkflowRunsInfinite
- Update README with GhClientProvider setup and new hook documentation

### Features

* @api-hooks/gh ([1682038](https://github.com/ElJijuna/api-hooks/commit/1682038e2cf5b5e394155d0c72bf73a39232f88a))
* add @api-hooks/crates package with hooks for crates.io REST API ([49b51ed](https://github.com/ElJijuna/api-hooks/commit/49b51ed6fb65ef57ef9f971eb3276cb6c798ed1b))
