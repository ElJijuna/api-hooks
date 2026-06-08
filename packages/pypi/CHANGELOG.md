## 1.0.0 (2026-06-08)

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

* **@api-hooks/dh:** add hooks for Docker Hub API integration ([c88c2b5](https://github.com/ElJijuna/api-hooks/commit/c88c2b5074a18ff08b25c6a69e67647e041a6d2d))
* **@api-hooks/gh:** add GhClientProvider context and hooks for notifications, issues, search, and workflow runs ([1682038](https://github.com/ElJijuna/api-hooks/commit/1682038e2cf5b5e394155d0c72bf73a39232f88a))
* **@api-hooks/gh:** add global advisory hooks (advisories, advisory, advisoryByCve) ([9277173](https://github.com/ElJijuna/api-hooks/commit/9277173f75b5b325a0a391c1a0b0a57959054b1b))
* **@api-hooks/gh:** add hook useGhRepoMultipleRaw ([e29f39c](https://github.com/ElJijuna/api-hooks/commit/e29f39cc41eb314247734de5119736363ca00a08))
* **@api-hooks/gh:** add hooks for gh-api-client ([fd602b7](https://github.com/ElJijuna/api-hooks/commit/fd602b7c111dc587b56a2b18ac0eb055bc0071cd))
* **@api-hooks/gh:** add hooks for gist, user, repo, PR and commit sub-operations ([c035814](https://github.com/ElJijuna/api-hooks/commit/c03581496acf430ffddb6dcaa9615dedfff0c3fa))
* **@api-hooks/gh:** add new hooks keys ([9050cf7](https://github.com/ElJijuna/api-hooks/commit/9050cf73ea777c0e3a16dbadb33dad41a73e2636))
* **@api-hooks/gh:** add repo, issue, PR, commit, org and search hooks ([39e1774](https://github.com/ElJijuna/api-hooks/commit/39e1774c9bb9ef8cd8d4b1af79fb9ab8568d97ad))
* **@api-hooks/gh:** add useGhCreateGist mutation hook (closes [#62](https://github.com/ElJijuna/api-hooks/issues/62)) ([16b61b2](https://github.com/ElJijuna/api-hooks/commit/16b61b23572696348d767f9ac1b395734b6afa40))
* **@api-hooks/gh:** add useGhDeleteGist mutation hook (closes [#64](https://github.com/ElJijuna/api-hooks/issues/64)) ([51462ef](https://github.com/ElJijuna/api-hooks/commit/51462ef3d7d36381a30faa7699b1e6f394fadc1d))
* **@api-hooks/gh:** add useGhGist hook (closes [#57](https://github.com/ElJijuna/api-hooks/issues/57)) ([34c0421](https://github.com/ElJijuna/api-hooks/commit/34c042124c6ad9e1fb5703e72422ff6d6ce55f6f))
* **@api-hooks/gh:** add useGhGistsInfinite hook ([41072f2](https://github.com/ElJijuna/api-hooks/commit/41072f2a6092b27faa34a15eedb15a54997e4544))
* **@api-hooks/gh:** add useGhUpdateGist mutation hook closes [#63](https://github.com/ElJijuna/api-hooks/issues/63) ([4f22e79](https://github.com/ElJijuna/api-hooks/commit/4f22e79edf021c99a7bb4e74bcfba19b377291e4))
* **@api-hooks/gh:** implement hooks for gh-api-client v1.16.0 ([c62838e](https://github.com/ElJijuna/api-hooks/commit/c62838e7fb8b2656452e94a84f0de2b08978a65a))
* **@api-hooks/npm:** add useNpmSearchInfinite and useNpmMaintainerPackagesInfinite hooks ([864bdf4](https://github.com/ElJijuna/api-hooks/commit/864bdf4315c9119edc5acc2140b106164964c1f9))
* **@api-hooks/npm:** add useNpmUser and useNpmUserPackages hooks ([54a3e4e](https://github.com/ElJijuna/api-hooks/commit/54a3e4ea65612ab6d03875f99ea099eb4d1af6d1))
* **@api-hooks/npm:** add useNpmWhoami hook to retrieve npm username associated with auth token ([02ce389](https://github.com/ElJijuna/api-hooks/commit/02ce3896fe4cf1bd31689b43ee3955b2ca746531))
* **@api-hooks/osv:** add osvQueryKeys factory (closes [#70](https://github.com/ElJijuna/api-hooks/issues/70)) ([0d7595f](https://github.com/ElJijuna/api-hooks/commit/0d7595fa349b534b7773896dc1ff55a3b8efa809))
* **@api-hooks/osv:** add package skeleton (closes [#69](https://github.com/ElJijuna/api-hooks/issues/69)) ([8d52bca](https://github.com/ElJijuna/api-hooks/commit/8d52bca9fa679f80e5cca18a7cdc073db1cd84c6))
* **@api-hooks/osv:** add types re-exports (closes [#74](https://github.com/ElJijuna/api-hooks/issues/74)) ([76f116b](https://github.com/ElJijuna/api-hooks/commit/76f116b4ef1cdd8c388d37556e6726a9be9484ac))
* **@api-hooks/osv:** add useOsvQuery hook (closes [#72](https://github.com/ElJijuna/api-hooks/issues/72)) ([534a2c2](https://github.com/ElJijuna/api-hooks/commit/534a2c20c20fcf934e3f8d09e13a61593c8c5ab3))
* **@api-hooks/osv:** add useOsvQueryBatch hook (closes [#73](https://github.com/ElJijuna/api-hooks/issues/73)) ([4849b88](https://github.com/ElJijuna/api-hooks/commit/4849b88f2e610a98593acc58a42b1d579f5354d5))
* **@api-hooks/osv:** add useOsvVuln hook (closes [#71](https://github.com/ElJijuna/api-hooks/issues/71)) ([b55393b](https://github.com/ElJijuna/api-hooks/commit/b55393b0959d451d077bf6b925e48f74a878e01d))
* **@api-hooks/pypi:** add initial release with React hooks for PyPI API integration ([6a1a1b3](https://github.com/ElJijuna/api-hooks/commit/6a1a1b3f58449248a12fa9b68fe411cc1f85ccc0))
* **@api-hooks/pypi:** add semantic release configuration and export new hook ([6a66c4d](https://github.com/ElJijuna/api-hooks/commit/6a66c4dcbc01b895373c57b28cca71f07af1bb84))
* **@api-hooks/pypi:** add support for PyPI documentation and release process ([63686a8](https://github.com/ElJijuna/api-hooks/commit/63686a85ff67fac6a0803be44da854934378476b))
* **@api-hooks/pypi:** enhance hooks with detailed JSDoc comments and add types export ([1bbf501](https://github.com/ElJijuna/api-hooks/commit/1bbf5010e6782d65f467ab8c864d8b959c9145fb))
* add typedoc, update .gitignore and add .npmignore per package ([#55](https://github.com/ElJijuna/api-hooks/issues/55)) ([8b65d57](https://github.com/ElJijuna/api-hooks/commit/8b65d577d7afdf8a99079088c0f7347d5662e18e))
* add useGhGists in @api-hooks/gh (closes [#56](https://github.com/ElJijuna/api-hooks/issues/56)) ([4d84035](https://github.com/ElJijuna/api-hooks/commit/4d84035098260a0e88b816766fae0d808611bbca))
* **bp:** implement useBpPackageHistory ([#50](https://github.com/ElJijuna/api-hooks/issues/50)) ([7b3ea2c](https://github.com/ElJijuna/api-hooks/commit/7b3ea2cd083b32fa40c0509652bdbacb39bc5cfa))
* **bp:** implement useBpPackageSimilar ([#51](https://github.com/ElJijuna/api-hooks/issues/51)) ([33ea4ba](https://github.com/ElJijuna/api-hooks/commit/33ea4ba4dff96d79a0053ddac90b20fa9bdfcd25))
* **bp:** scaffold @api-hooks/bp package and implement useBpPackageSize ([#48](https://github.com/ElJijuna/api-hooks/issues/48)) ([048bf75](https://github.com/ElJijuna/api-hooks/commit/048bf75044a6ddc5bc0f86fa45af338e749dea9b))
* implement useBpPackageVersionSize ([#49](https://github.com/ElJijuna/api-hooks/issues/49)) ([9b56796](https://github.com/ElJijuna/api-hooks/commit/9b56796d793e9441dccf2932517a3c95a519ee93))
* implement useGhUser with signal support ([#19](https://github.com/ElJijuna/api-hooks/issues/19)) ([3f82d7a](https://github.com/ElJijuna/api-hooks/commit/3f82d7a9a5e1a167d17a89b7bf4140411f9d2a22))
* implement useNpmMaintainer ([#9](https://github.com/ElJijuna/api-hooks/issues/9)) ([14cf2f4](https://github.com/ElJijuna/api-hooks/commit/14cf2f4412022312c181591d880f05ac016397b8))
* implement useNpmMaintainerPackages ([#10](https://github.com/ElJijuna/api-hooks/issues/10)) ([721005d](https://github.com/ElJijuna/api-hooks/commit/721005d10f32831430c9558fcfbf57e0b6044990))
* implement useNpmSearch — completes @api-hooks/npm ([#11](https://github.com/ElJijuna/api-hooks/issues/11)) ([019709e](https://github.com/ElJijuna/api-hooks/commit/019709e16775d5539e5e24df113c4b1c8e401871))
* **npm:** add package version downloads hook (closes [#81](https://github.com/ElJijuna/api-hooks/issues/81)) ([a60b2a2](https://github.com/ElJijuna/api-hooks/commit/a60b2a2f0587d59b7ceca8e8ed9320ec1c15cdd2))
* **npm:** expose npmjs-api-client v1.7 hooks. ([22b9d43](https://github.com/ElJijuna/api-hooks/commit/22b9d431cba6e16c7d3c97a7aa80cc4cf364864d))
* **npm:** extract NpmClient to shared React context ([f4cfe21](https://github.com/ElJijuna/api-hooks/commit/f4cfe216fad64b1150ea38d3ead70ce8a3eebeb9)), closes [#79](https://github.com/ElJijuna/api-hooks/issues/79)
* **npm:** implement hooks for new npmjs-api-client@1.6.0 APIs ([7e4e0f4](https://github.com/ElJijuna/api-hooks/commit/7e4e0f4f21f87765119fb136ac4640f9d9b60802))
* **npm:** implement useNpmPackage ([#1](https://github.com/ElJijuna/api-hooks/issues/1)) ([df1d5ea](https://github.com/ElJijuna/api-hooks/commit/df1d5eafd9b9c76ec6c31ffea4c27ec7bf801505))
* **npm:** implement useNpmPackageDistTags ([#5](https://github.com/ElJijuna/api-hooks/issues/5)) ([de38b25](https://github.com/ElJijuna/api-hooks/commit/de38b2594d02a22ae156a73ebff414eccbd15611))
* **npm:** implement useNpmPackageDownloadRange ([#8](https://github.com/ElJijuna/api-hooks/issues/8)) ([c9e52e6](https://github.com/ElJijuna/api-hooks/commit/c9e52e6526ad7b353b042cbcbd012f6f006a4294))
* **npm:** implement useNpmPackageDownloads ([#7](https://github.com/ElJijuna/api-hooks/issues/7)) ([465a9ae](https://github.com/ElJijuna/api-hooks/commit/465a9ae39481523389a6692ca72614b6577c487e))
* **npm:** implement useNpmPackageLatest ([#3](https://github.com/ElJijuna/api-hooks/issues/3)) ([d81769d](https://github.com/ElJijuna/api-hooks/commit/d81769d310eb01b20945dd02a1a29fabe26899bb))
* **npm:** implement useNpmPackageMaintainers ([#6](https://github.com/ElJijuna/api-hooks/issues/6)) ([3334a14](https://github.com/ElJijuna/api-hooks/commit/3334a14aca71d5ea86b4e944aa20b85e5c139b1c))
* **npm:** implement useNpmPackageVersion ([#2](https://github.com/ElJijuna/api-hooks/issues/2)) ([c7a9a75](https://github.com/ElJijuna/api-hooks/commit/c7a9a75139dfa599d77b0a71dee4463fabb838f5))
* **npm:** implement useNpmPackageVersions ([#4](https://github.com/ElJijuna/api-hooks/issues/4)) ([08020b2](https://github.com/ElJijuna/api-hooks/commit/08020b28f180e68d4e261a82d28b8d56e4453f02))

### Bug Fixes

* **@api-hooks/bp:** update README ([56f99f7](https://github.com/ElJijuna/api-hooks/commit/56f99f79d2bc1ce5a0bbc8d5084969a23cfed44d))
* **@api-hooks/gh:** update gh-api-client dependency ([20d4f9d](https://github.com/ElJijuna/api-hooks/commit/20d4f9d9e07cd839836062a420e238dcbb9af229))
* **@api-hooks/npm:** update README ([d0c95b3](https://github.com/ElJijuna/api-hooks/commit/d0c95b38497e08a4347878a81af2b975988dd690))
* **@api-hooks/osv:** update README ([7771b29](https://github.com/ElJijuna/api-hooks/commit/7771b291f70de0bb079bf3a0ff447d1e38585fc1))
* add token prop in Gist hooks to use in application, pending others hooks. ([faa2f67](https://github.com/ElJijuna/api-hooks/commit/faa2f67e4e338736950bbd72e1b6ec97221defd9))
* **ci:** prevent cross-package releases by adding catch-all releaseRule ([f02c7a2](https://github.com/ElJijuna/api-hooks/commit/f02c7a2e0a9bd99c8b132f2e242e4f74f9db799c))
* **ci:** use negated-scope globs instead of bare catch-all to block cross-package releases ([d869852](https://github.com/ElJijuna/api-hooks/commit/d869852ad6dd72d618c360e147b76d1833d82a7f))
* move gh-api-client to dependencies. ([ba072a3](https://github.com/ElJijuna/api-hooks/commit/ba072a314f004c6325bbcd8cceb17d9bcc883ec4))
* update main and exports in packages jsons from all packages. ([e7c3dc7](https://github.com/ElJijuna/api-hooks/commit/e7c3dc77cc979e958a6798c6216bf6ae8a36833a))
* update workflow to publish api-hooks ([755ad65](https://github.com/ElJijuna/api-hooks/commit/755ad659bb80b7f811738e987a8ecbef6a659dd8))

### Documentation

* add documentation in hooks. ([deb3aa5](https://github.com/ElJijuna/api-hooks/commit/deb3aa5e9c5471207d48a839cba45f6619b6ed0e))
* add README ([8cd657c](https://github.com/ElJijuna/api-hooks/commit/8cd657c4f1c09361e3b8ae7755eac716455c5740))
* add REAME. ([1a1bc01](https://github.com/ElJijuna/api-hooks/commit/1a1bc01b74cef019c3bdf9fcf050a89b9a056e19))
* update README and ROADMAP. ([5e443a9](https://github.com/ElJijuna/api-hooks/commit/5e443a9d5b637b85a2070cd7dc74e4c2a94f0796))
* update READMEs ([e258e4e](https://github.com/ElJijuna/api-hooks/commit/e258e4e8d81ad883f092e66709fcebeda8ee950f))
* update READMEs in base gh and npm ([7a36718](https://github.com/ElJijuna/api-hooks/commit/7a36718069d90b00de80e1961da2f63be3dc4cf3))

# Changelog

## 1.0.0

- Initial release with React Query hooks for `pypi-api-client`.
