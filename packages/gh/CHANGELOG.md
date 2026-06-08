## [2.3.1](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.3.0...@api-hooks/gh@2.3.1) (2026-06-02)

### Bug Fixes

* **@api-hooks/gh:** update gh-api-client dependency ([20d4f9d](https://github.com/ElJijuna/api-hooks/commit/20d4f9d9e07cd839836062a420e238dcbb9af229))

## [2.3.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.2.0...@api-hooks/gh@2.3.0) (2026-05-26)

### Features

* **@api-hooks/gh:** add new hooks keys ([9050cf7](https://github.com/ElJijuna/api-hooks/commit/9050cf73ea777c0e3a16dbadb33dad41a73e2636))
* **@api-hooks/gh:** implement hooks for gh-api-client v1.16.0 ([c62838e](https://github.com/ElJijuna/api-hooks/commit/c62838e7fb8b2656452e94a84f0de2b08978a65a))

## [2.2.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.1.0...@api-hooks/gh@2.2.0) (2026-05-24)

### Features

* **@api-hooks/gh:** add hooks for gh-api-client ([fd602b7](https://github.com/ElJijuna/api-hooks/commit/fd602b7c111dc587b56a2b18ac0eb055bc0071cd))

## [2.1.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@2.0.0...@api-hooks/gh@2.1.0) (2026-05-23)

### Features

* **@api-hooks/gh:** add hook useGhRepoMultipleRaw ([e29f39c](https://github.com/ElJijuna/api-hooks/commit/e29f39cc41eb314247734de5119736363ca00a08))

## [2.0.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.14.0...@api-hooks/gh@2.0.0) (2026-05-20)

### ⚠ BREAKING CHANGES

* **@api-hooks/gh:** the `token` option has been removed from all hooks. Configure
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

* **@api-hooks/gh:** add GhClientProvider context and hooks for notifications, issues, search, and workflow runs ([1682038](https://github.com/ElJijuna/api-hooks/commit/1682038e2cf5b5e394155d0c72bf73a39232f88a))

## [1.14.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.13.0...@api-hooks/gh@1.14.0) (2026-05-13)

### Features

* **@api-hooks/gh:** add hooks for gist, user, repo, PR and commit sub-operations ([c035814](https://github.com/ElJijuna/api-hooks/commit/c03581496acf430ffddb6dcaa9615dedfff0c3fa))
### Documentation

* update READMEs in base gh and npm ([7a36718](https://github.com/ElJijuna/api-hooks/commit/7a36718069d90b00de80e1961da2f63be3dc4cf3))

## [1.13.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.12.0...@api-hooks/gh@1.13.0) (2026-05-12)

### Features

* **@api-hooks/gh:** add global advisory hooks (advisories, advisory, advisoryByCve) ([9277173](https://github.com/ElJijuna/api-hooks/commit/9277173f75b5b325a0a391c1a0b0a57959054b1b))
* **@api-hooks/gh:** add repo, issue, PR, commit, org and search hooks ([39e1774](https://github.com/ElJijuna/api-hooks/commit/39e1774c9bb9ef8cd8d4b1af79fb9ab8568d97ad))
* **@api-hooks/gh:** add useGhGistsInfinite hook ([41072f2](https://github.com/ElJijuna/api-hooks/commit/41072f2a6092b27faa34a15eedb15a54997e4544))
### Documentation

* add documentation in hooks. ([deb3aa5](https://github.com/ElJijuna/api-hooks/commit/deb3aa5e9c5471207d48a839cba45f6619b6ed0e))
* update READMEs ([e258e4e](https://github.com/ElJijuna/api-hooks/commit/e258e4e8d81ad883f092e66709fcebeda8ee950f))

## [1.8.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.4...@api-hooks/gh@1.8.0) (2026-04-18)

### Features

* add useGhGists in @api-hooks/gh (closes [#56](https://github.com/ElJijuna/api-hooks/issues/56)) ([4d84035](https://github.com/ElJijuna/api-hooks/commit/4d84035098260a0e88b816766fae0d808611bbca))

## [1.7.4](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.3...@api-hooks/gh@1.7.4) (2026-04-18)

### Bug Fixes

* move gh-api-client to dependencies. ([ba072a3](https://github.com/ElJijuna/api-hooks/commit/ba072a314f004c6325bbcd8cceb17d9bcc883ec4))

## [1.7.3](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.2...@api-hooks/gh@1.7.3) (2026-04-18)

### Bug Fixes

* add token prop in Gist hooks to use in application, pending others hooks. ([faa2f67](https://github.com/ElJijuna/api-hooks/commit/faa2f67e4e338736950bbd72e1b6ec97221defd9))

## [1.7.2](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.1...@api-hooks/gh@1.7.2) (2026-04-18)

### Bug Fixes

* update workflow to publish api-hooks ([755ad65](https://github.com/ElJijuna/api-hooks/commit/755ad659bb80b7f811738e987a8ecbef6a659dd8))

## [1.7.1](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.7.0...@api-hooks/gh@1.7.1) (2026-04-18)

### Bug Fixes

* update main and exports in packages jsons from all packages. ([e7c3dc7](https://github.com/ElJijuna/api-hooks/commit/e7c3dc77cc979e958a6798c6216bf6ae8a36833a))

## [1.6.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.5.0...@api-hooks/gh@1.6.0) (2026-04-17)

### Features

* **@api-hooks/gh:** add useGhCreateGist mutation hook (closes [#62](https://github.com/ElJijuna/api-hooks/issues/62)) ([16b61b2](https://github.com/ElJijuna/api-hooks/commit/16b61b23572696348d767f9ac1b395734b6afa40))
* **@api-hooks/gh:** add useGhDeleteGist mutation hook (closes [#64](https://github.com/ElJijuna/api-hooks/issues/64)) ([51462ef](https://github.com/ElJijuna/api-hooks/commit/51462ef3d7d36381a30faa7699b1e6f394fadc1d))
* **@api-hooks/gh:** add useGhGist hook (closes [#57](https://github.com/ElJijuna/api-hooks/issues/57)) ([34c0421](https://github.com/ElJijuna/api-hooks/commit/34c042124c6ad9e1fb5703e72422ff6d6ce55f6f))
* **@api-hooks/gh:** add useGhUpdateGist mutation hook closes [#63](https://github.com/ElJijuna/api-hooks/issues/63) ([4f22e79](https://github.com/ElJijuna/api-hooks/commit/4f22e79edf021c99a7bb4e74bcfba19b377291e4))

### Documentation

* update README and ROADMAP. ([5e443a9](https://github.com/ElJijuna/api-hooks/commit/5e443a9d5b637b85a2070cd7dc74e4c2a94f0796))

## [1.5.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.4.0...@api-hooks/gh@1.5.0) (2026-04-17)

### Features

* add typedoc, update .gitignore and add .npmignore per package ([#55](https://github.com/ElJijuna/api-hooks/issues/55)) ([8b65d57](https://github.com/ElJijuna/api-hooks/commit/8b65d577d7afdf8a99079088c0f7347d5662e18e))

### Documentation

* add README ([8cd657c](https://github.com/ElJijuna/api-hooks/commit/8cd657c4f1c09361e3b8ae7755eac716455c5740))

## [1.4.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.3.0...@api-hooks/gh@1.4.0) (2026-04-17)

### Features

* implement useBpPackageVersionSize ([#49](https://github.com/ElJijuna/api-hooks/issues/49)) ([9b56796](https://github.com/ElJijuna/api-hooks/commit/9b56796d793e9441dccf2932517a3c95a519ee93))

## [1.3.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.2.0...@api-hooks/gh@1.3.0) (2026-04-16)

### Features

* implement useGhUser with signal support ([#19](https://github.com/ElJijuna/api-hooks/issues/19)) ([3f82d7a](https://github.com/ElJijuna/api-hooks/commit/3f82d7a9a5e1a167d17a89b7bf4140411f9d2a22))

## [1.2.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.1.0...@api-hooks/gh@1.2.0) (2026-04-16)

### Features

* implement useNpmMaintainerPackages ([#10](https://github.com/ElJijuna/api-hooks/issues/10)) ([721005d](https://github.com/ElJijuna/api-hooks/commit/721005d10f32831430c9558fcfbf57e0b6044990))
* implement useNpmSearch — completes @api-hooks/npm ([#11](https://github.com/ElJijuna/api-hooks/issues/11)) ([019709e](https://github.com/ElJijuna/api-hooks/commit/019709e16775d5539e5e24df113c4b1c8e401871))

### Documentation

* add REAME. ([1a1bc01](https://github.com/ElJijuna/api-hooks/commit/1a1bc01b74cef019c3bdf9fcf050a89b9a056e19))

## [1.1.0](https://github.com/ElJijuna/api-hooks/compare/@api-hooks/gh@1.0.0...@api-hooks/gh@1.1.0) (2026-04-16)

### Features

* implement useNpmMaintainer ([#9](https://github.com/ElJijuna/api-hooks/issues/9)) ([14cf2f4](https://github.com/ElJijuna/api-hooks/commit/14cf2f4412022312c181591d880f05ac016397b8))
