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
* add React hooks for Swift Package Registry and Index APIs ([a23d2e6](https://github.com/ElJijuna/api-hooks/commit/a23d2e668e1d6528097a7e753c776ffdb71c6095))
