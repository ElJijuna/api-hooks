# @api-hooks/npm — ROADMAP

Hooks built on [`npmjs-api-client`](https://www.npmjs.com/package/npmjs-api-client) + `@tanstack/react-query`.

---

## Package hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ `useNpmPackage(name)` | `npm.package(name).get()` | `NpmPackument` |
| ✅ `useNpmPackageVersion(name, version)` | `npm.package(name).version(ver).get()` | `NpmPackageVersion` |
| ✅ `useNpmPackageLatest(name)` | `npm.package(name).latest().get()` | `NpmPackageVersion` |
| ✅ `useNpmPackageVersions(name)` | `npm.package(name).versions()` | `NpmPackageVersion[]` |
| ✅ `useNpmPackageDistTags(name)` | `npm.package(name).distTags()` | `NpmDistTags` |
| ✅ `useNpmPackageMaintainers(name)` | `npm.package(name).maintainers()` | `NpmPerson[]` |
| ✅ `useNpmPackageDownloads(name, options?)` | `npm.package(name).downloads(period)` | `NpmDownloadPoint` |
| ✅ `useNpmPackageDownloadRange(name, options?)` | `npm.package(name).downloadRange(period)` | `NpmDownloadRange` |
| ✅ `useNpmPackageScore(name)` | `npm.package(name).score()` | `NpmsScore` |
| ✅ `useNpmPackageSize(name)` | `npm.package(name).size()` | `PackagephobiaSize` |
| ✅ `useNpmPackageCdnStats(name, options?)` | `npm.package(name).cdnStats(groupBy, period)` | `JsdelivrStats` |

## Version hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ `useNpmPackageVersionDownloads(name, version, options?)` | `npm.package(name).version(ver).downloads(period)` | `NpmVersionDownloadPoint` |
| ✅ `useNpmPackageVersionSize(name, version)` | `npm.package(name).version(ver).size()` | `PackagephobiaSize` |
| ✅ `useNpmPackageVersionFiles(name, version)` | `npm.package(name).version(ver).files()` | `UnpkgFile` |
| ✅ `useNpmPackageVersionCdnStats(name, version, options?)` | `npm.package(name).version(ver).cdnStats(groupBy, period)` | `JsdelivrStats` |
| ✅ `useNpmPackageVersionDependencies(name, version)` | `npm.package(name).version(ver).dependencies()` | `DepsDevDependencies` |

## Bulk & audit hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ `useNpmBulkDownloads(packages, options?)` | `npm.bulkDownloads(packages, period)` | `NpmBulkDownloads` |
| ✅ `useNpmAudit()` | `npm.audit(payload)` | `NpmAuditResult` |
| ✅ `useNpmAuditQuick()` | `npm.auditQuick(payload)` | `NpmAuditQuickResult` |

## Maintainer / user hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ `useNpmMaintainer(username)` | `npm.maintainer(username).info()` | `NpmUser` |
| ✅ `useNpmMaintainerPackages(username, options?)` | `npm.maintainer(username).packages(params)` | `NpmSearchResult` |
| ✅ `useNpmMaintainerAvatar(username)` | `npm.maintainer(username).avatar()` | `string \| undefined` |

## Search hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ `useNpmSearch(text, options?)` | `npm.search(params)` | `NpmSearchResult` |

## Top / ranking hooks

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ `useNpmTopPackages(options?)` | `npm.topPackages(n)` | `NpmSearchResult` |
| ✅ `useNpmTopByPopularity(options?)` | `npm.topByPopularity(n)` | `NpmSearchResult` |
| ✅ `useNpmTopByQuality(options?)` | `npm.topByQuality(n)` | `NpmSearchResult` |
| ✅ `useNpmTopByMaintenance(options?)` | `npm.topByMaintenance(n)` | `NpmSearchResult` |
| ✅ `useNpmTopByKeyword(keyword, options?)` | `npm.topByKeyword(keyword, n)` | `NpmSearchResult` |
| ✅ `useNpmTopByScope(scope, options?)` | `npm.topByScope(scope, n)` | `NpmSearchResult` |

## Organization hooks

These endpoints require a registry token with org access. Pass an authenticated `NpmClient` or `options={{ token }}` to `NpmClientProvider`.

| Hook | Client method | Returns |
| ---- | ------------- | ------- |
| ✅ `useNpmOrgPackages(org, options?)` | `npm.org(org).packages()` | `NpmOrgPackages` |
| ✅ `useNpmOrgTeams(org, options?)` | `npm.org(org).teams()` | `string[]` |
| ✅ `useNpmOrgMembers(org, options?)` | `npm.org(org).members()` | `NpmOrgMembers` |
| ✅ `useNpmOrgTeamMembers(org, team, options?)` | `npm.org(org).teamMembers(team)` | `string[]` |
