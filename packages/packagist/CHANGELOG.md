## 1.0.0 (2026-06-08)

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
* add hooks for Packagist API integration ([567a1be](https://github.com/ElJijuna/api-hooks/commit/567a1be85387c96e49da893dfb9a97ab489ae322))

### Refactoring

* streamline type imports and improve consistency across files ([72e6a3d](https://github.com/ElJijuna/api-hooks/commit/72e6a3d226e78c59cbc3e9388e932f7c0283a2e0))

### Documentation

* add logo image for improved visual appeal ([5258bdb](https://github.com/ElJijuna/api-hooks/commit/5258bdb93f458e975d3bef04d62791d51ba12c0b))

# Changelog

All notable changes to this package will be documented in this file.

See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.
