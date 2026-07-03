## 1.0.0 (2026-07-03)

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
* initialize @api-hooks/hex package with React hooks for Hex.pm API ([3517a29](https://github.com/ElJijuna/api-hooks/commit/3517a296fbc39e47433a39a000d6b69fd3b1669b))
