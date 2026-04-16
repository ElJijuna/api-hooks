# @api-hooks/npm — ROADMAP

Hooks built on [`npmjs-api-client`](https://www.npmjs.com/package/npmjs-api-client) + `@tanstack/react-query`.

---

## Package hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ [`useNpmPackage(name)`](https://github.com/ElJijuna/api-hooks/issues/1) | `npm.package(name).get()` | `NpmPackument` |
| ✅ [`useNpmPackageVersion(name, version)`](https://github.com/ElJijuna/api-hooks/issues/2) | `npm.package(name).version(ver).get()` | `NpmPackageVersion` |
| ✅ [`useNpmPackageLatest(name)`](https://github.com/ElJijuna/api-hooks/issues/3) | `npm.package(name).latest().get()` | `NpmPackageVersion` |
| `useNpmPackageVersions(name)` | `npm.package(name).versions()` | `NpmPackageVersion[]` |
| `useNpmPackageDistTags(name)` | `npm.package(name).distTags()` | `NpmDistTags` |
| `useNpmPackageMaintainers(name)` | `npm.package(name).maintainers()` | `NpmPerson[]` |
| `useNpmPackageDownloads(name, period?)` | `npm.package(name).downloads(period)` | `NpmDownloadPoint` |
| `useNpmPackageDownloadRange(name, period?)` | `npm.package(name).downloadRange(period)` | `NpmDownloadRange` |

## Maintainer / user hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| `useNpmMaintainer(username)` | `npm.maintainer(username).info()` | `NpmUser` |
| `useNpmMaintainerPackages(username, params?)` | `npm.maintainer(username).packages(params)` | `NpmSearchResult` |

## Search hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| `useNpmSearch(params)` | `npm.search(params)` | `NpmSearchResult` |
