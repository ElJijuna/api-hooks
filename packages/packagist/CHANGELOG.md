## [1.1.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/packagist@1.0.0...@api-hooks/packagist@1.1.0) (2026-07-02)

### Features

* add mutationOptions support to usePackagistEditPackage ([7dd9f5c](https://github.com/ElJijuna/api-hooks/commit/7dd9f5c48aa61e5c0c14350bf4dc2c729e820566))
* add mutationOptions support to usePackagistUpdatePackage ([28abfbd](https://github.com/ElJijuna/api-hooks/commit/28abfbd5c304e86297a45e126564cedc383400da))
* add query overrides types for useQuery, useInfiniteQuery, and useMutation ([0defe97](https://github.com/ElJijuna/api-hooks/commit/0defe979a3d15e857152b3f6f08abeab34b22bda))
* add queryOptions support to usePackagistListPackages ([a2344d3](https://github.com/ElJijuna/api-hooks/commit/a2344d39d23e613552a73fb209b48e5c73bea83e))
* add queryOptions support to usePackagistMetadataChanges ([4944eda](https://github.com/ElJijuna/api-hooks/commit/4944eda7a4e3671c3309858d6024ec455c7842ad))
* add queryOptions support to usePackagistPackageSecurityAdvisories ([308c602](https://github.com/ElJijuna/api-hooks/commit/308c6021f7cbfa8c6af6322e3304cc034e540eb1))
* add queryOptions support to usePackagistPackageStats ([70ac395](https://github.com/ElJijuna/api-hooks/commit/70ac3959e7822a72c60b5259e02b415295976f12))
* add queryOptions support to usePackagistSecurityAdvisories ([d757f22](https://github.com/ElJijuna/api-hooks/commit/d757f228661b6345db0babc7706da54d8f9ad40d))
* add support for mutationOptions in usePackagistCreatePackage ([5e133f6](https://github.com/ElJijuna/api-hooks/commit/5e133f6779827e7e5167ea9a8e7827697ebfbcbe))
* add support for queryOptions in usePackagistPackage ([8bb2274](https://github.com/ElJijuna/api-hooks/commit/8bb2274fb99f66551b803c2961ebeebae9e3cec6))
* add support for queryOptions in usePackagistPackageMetadata ([6d23c66](https://github.com/ElJijuna/api-hooks/commit/6d23c669b5ec4bc8c9a3a16aad11b4862633d69e))
* add support for queryOptions in usePackagistPopular ([fcc7c3b](https://github.com/ElJijuna/api-hooks/commit/fcc7c3bfe91756de1f55fee8814e0706019b3e17))
* add support for queryOptions in usePackagistSearch ([f5e9c35](https://github.com/ElJijuna/api-hooks/commit/f5e9c357ad370ab4d099a4a0fcbc1842e9b6a0e6))
* add support for queryOptions in usePackagistStatistics ([d0e5004](https://github.com/ElJijuna/api-hooks/commit/d0e500487228feec01158aeeb1f8cf8bde694f82))

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
