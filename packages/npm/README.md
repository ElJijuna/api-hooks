# @api-hooks/npm

React hooks for the [npm registry API](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md), built on [`npmjs-api-client`](https://www.npmjs.com/package/npmjs-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/npm)](https://www.npmjs.com/package/@api-hooks/npm)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/npm)](https://www.npmjs.com/package/@api-hooks/npm)
[![CI](https://github.com/ElJijuna/api-hooks/actions/workflows/ci.yml/badge.svg)](https://github.com/ElJijuna/api-hooks/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Requirements

| Peer dependency | Version |
| --------------- | ------- |
| `react` | `>=19.0.0` |
| `@tanstack/react-query` | `^5.0.0` |

## Installation

```bash
npm install @api-hooks/npm @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more.

Audit hooks (`useNpmAudit`, `useNpmAuditQuick`) return a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) since they perform POST requests.

### Package hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useNpmPackage(name)`](#usenpmpackagename) | Full packument (all versions metadata) | `NpmPackument` |
| [`useNpmPackageVersion(name, version)`](#usenpmpackageversionname-version) | Manifest for a specific version | `NpmPackageVersion` |
| [`useNpmPackageLatest(name)`](#usenpmpackagelatestname) | Manifest for the `latest` dist-tag | `NpmPackageVersion` |
| [`useNpmPackageVersions(name)`](#usenpmpackageversionsname) | All published versions (oldest → newest) | `NpmPackageVersion[]` |
| [`useNpmPackageDistTags(name)`](#usenpmpackagedisttagsname) | Dist-tags map (`latest`, `next`, …) | `NpmDistTags` |
| [`useNpmPackageMaintainers(name)`](#usenpmpackagemaintainersname) | Current maintainers of the package | `NpmPerson[]` |
| [`useNpmPackageDownloads(name, options?)`](#usenpmpackagedownloadsname-options) | Total download count for a period | `NpmDownloadPoint` |
| [`useNpmPackageVersionDownloads(name, version, options?)`](#usenpmpackageversiondownloadsname-version-options) | Download count for a specific version | `NpmVersionDownloadPoint` |
| [`useNpmPackageDownloadRange(name, options?)`](#usenpmpackagedownloadrangename-options) | Per-day download breakdown | `NpmDownloadRange` |
| [`useNpmPackageScore(name)`](#usenpmpackagescorename) | Quality, popularity & maintenance score (npms.io) | `NpmsScore` |
| [`useNpmPackageSize(name)`](#usenpmpackagesizename) | Publish & install size (Packagephobia) | `PackagephobiaSize` |
| [`useNpmPackageCdnStats(name, options?)`](#usenpmpackagecdnstatsname-options) | CDN usage statistics (jsDelivr) | `JsdelivrStats` |

### Version hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useNpmPackageVersionDownloads(name, version, options?)`](#usenpmpackageversiondownloadsname-version-options) | Download count for a specific version | `NpmVersionDownloadPoint` |
| [`useNpmPackageVersionSize(name, version)`](#usenpmpackageversionsizename-version) | Publish & install size for a specific version | `PackagephobiaSize` |
| [`useNpmPackageVersionFiles(name, version)`](#usenpmpackageversionfilesname-version) | File tree of a published version (unpkg) | `UnpkgFile` |
| [`useNpmPackageVersionCdnStats(name, version, options?)`](#usenpmpackageversioncdnstatsname-version-options) | CDN stats for a specific version (jsDelivr) | `JsdelivrStats` |
| [`useNpmPackageVersionDependencies(name, version)`](#usenpmpackageversiondependenciesname-version) | Resolved dependency graph (deps.dev) | `DepsDevDependencies` |

### Bulk & audit hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useNpmBulkDownloads(packages, options?)`](#usenpmbulkdownloadspackages-options) | Download counts for multiple packages at once | `NpmBulkDownloads` |
| [`useNpmAudit()`](#usenpmaudit) | Full security audit with advisories (POST) | `NpmAuditResult` |
| [`useNpmAuditQuick()`](#usenpmauditquick) | Quick audit — vulnerability counts only (POST) | `NpmAuditQuickResult` |

### Maintainer hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useNpmMaintainer(username)`](#usenpmmaintainerusername) | Public profile of an npm user | `NpmUser` |
| [`useNpmMaintainerPackages(username, options?)`](#usenpmmaintainerpackagesusername-options) | Packages published by a user | `NpmSearchResult` |
| [`useNpmMaintainerAvatar(username)`](#usenpmmaintaineravatarusername) | Avatar URL (no network call) | `string` |

### Search hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useNpmSearch(text, options?)`](#usenpmsearchtext-options) | Full-text search across the registry | `NpmSearchResult` |

---

## API Reference

### `useNpmPackage(name)`

Fetches the full packument for a package — all published versions, dist-tags, maintainers, README, and more.

```tsx
import { useNpmPackage } from '@api-hooks/npm';

function PackageInfo() {
  const { data, isLoading, isError } = useNpmPackage('react');

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Package not found.</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Latest: {data['dist-tags'].latest}</p>
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |

---

### `useNpmPackageVersion(name, version)`

Fetches the manifest for a specific published version.

```tsx
const { data } = useNpmPackageVersion('react', '18.2.0');

console.log(data?.dist.tarball);
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` or `version` is empty |

---

### `useNpmPackageLatest(name)`

Shorthand for the `latest` dist-tag. Shares the cache with `useNpmPackageVersion(name, 'latest')`.

```tsx
const { data } = useNpmPackageLatest('typescript');

console.log(data?.version); // e.g. '5.7.0'
```

---

### `useNpmPackageVersions(name)`

Returns all published versions as an array sorted from oldest to newest.

```tsx
const { data: versions } = useNpmPackageVersions('react');

versions?.forEach(v => console.log(v.version));
```

---

### `useNpmPackageDistTags(name)`

Returns the dist-tags map for a package.

```tsx
const { data: tags } = useNpmPackageDistTags('react');
// { latest: '18.2.0', next: '19.0.0-beta.1' }
```

---

### `useNpmPackageMaintainers(name)`

Returns the current maintainers of a package.

```tsx
const { data: maintainers } = useNpmPackageMaintainers('react');

maintainers?.forEach(m => console.log(m.name, m.email));
```

---

### `useNpmPackageDownloads(name, options?)`

Fetches the total download count for a package over a period.

```tsx
const { data } = useNpmPackageDownloads('react', { period: 'last-week' });

console.log(data?.downloads); // e.g. 12345678
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `period` | `NpmDownloadPeriod` | `'last-month'` | `'last-day'`, `'last-week'`, `'last-month'`, `'last-year'`, or `'YYYY-MM-DD:YYYY-MM-DD'` |
| `enabled` | `boolean` | `true` | Disabled when `name` is empty |

---

### `useNpmPackageVersionDownloads(name, version, options?)`

Fetches the download count for a specific package version over the previous 7 days.

```tsx
const { data } = useNpmPackageVersionDownloads('react', '18.2.0');

console.log(data?.downloads); // e.g. 123456
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `period` | `NpmVersionDownloadPeriod` | `'last-week'` | npm currently supports only `'last-week'` for version downloads |
| `enabled` | `boolean` | `true` | Disabled when `name` or `version` is empty |

---

### `useNpmPackageDownloadRange(name, options?)`

Fetches the per-day download breakdown — ideal for rendering charts.

```tsx
const { data } = useNpmPackageDownloadRange('react', { period: 'last-month' });

data?.downloads.forEach(d => console.log(d.day, d.downloads));
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `period` | `NpmDownloadPeriod` | `'last-month'` | Same as `useNpmPackageDownloads` |
| `enabled` | `boolean` | `true` | Disabled when `name` is empty |

---

### `useNpmPackageScore(name)`

Fetches the quality, maintenance, and popularity score from [npms.io](https://npms.io).

```tsx
const { data } = useNpmPackageScore('react');

console.log(data?.score.final);                          // 0.97
console.log(data?.evaluation.popularity.dependentsCount); // 15000
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` is empty |

---

### `useNpmPackageSize(name)`

Fetches the publish size and full install size (including all transitive deps) from [Packagephobia](https://packagephobia.com).

```tsx
const { data } = useNpmPackageSize('react');

console.log(data?.install.pretty); // '300 kB'
console.log(data?.install.bytes);  // 307200
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` is empty |

---

### `useNpmPackageCdnStats(name, options?)`

Fetches CDN usage statistics from [jsDelivr](https://www.jsdelivr.com) — reflects browser/frontend usage complementing npm install counts.

```tsx
const { data } = useNpmPackageCdnStats('react');

console.log(data?.rank);  // 1
console.log(data?.total); // 1234567890
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `groupBy` | `'version' \| 'date'` | `'version'` | How to group results |
| `period` | `'day' \| 'week' \| 'month' \| 'year'` | `'month'` | Time window |
| `enabled` | `boolean` | `true` | Disabled when `name` is empty |

---

### `useNpmPackageVersionDownloads(name, version, options?)`

Fetches download counts for a specific version. npm only exposes this for `'last-week'`.

```tsx
const { data } = useNpmPackageVersionDownloads('react', '18.2.0');

console.log(data?.downloads); // 500000
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `period` | `'last-week'` | `'last-week'` | Only period supported by npm |
| `enabled` | `boolean` | `true` | Disabled when `name` or `version` is empty |

---

### `useNpmPackageVersionSize(name, version)`

Fetches publish & install size for a specific version from [Packagephobia](https://packagephobia.com).

```tsx
const { data } = useNpmPackageVersionSize('react', '18.2.0');

console.log(data?.install.pretty); // '300 kB'
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` or `version` is empty |

---

### `useNpmPackageVersionFiles(name, version)`

Fetches the complete file tree of a published version from [unpkg](https://unpkg.com) — useful for auditing package contents.

```tsx
const { data } = useNpmPackageVersionFiles('react', '18.2.0');

data?.files?.forEach(f => console.log(f.path, f.size));
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` or `version` is empty |

---

### `useNpmPackageVersionCdnStats(name, version, options?)`

Fetches CDN stats for a specific version from [jsDelivr](https://www.jsdelivr.com), grouped by file by default.

```tsx
const { data } = useNpmPackageVersionCdnStats('react', '18.2.0');

console.log(data?.total); // 1000000
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `groupBy` | `'file' \| 'date'` | `'file'` | How to group results |
| `period` | `'day' \| 'week' \| 'month' \| 'year'` | `'month'` | Time window |
| `enabled` | `boolean` | `true` | Disabled when `name` or `version` is empty |

---

### `useNpmPackageVersionDependencies(name, version)`

Fetches the fully resolved dependency graph from [deps.dev](https://deps.dev) — exact resolved versions for all direct and transitive dependencies.

```tsx
const { data } = useNpmPackageVersionDependencies('react', '18.2.0');

const direct = data?.nodes.filter(n => n.relation === 'DIRECT') ?? [];
direct.forEach(n => console.log(`${n.versionKey.name}@${n.versionKey.version}`));
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` or `version` is empty |

---

### `useNpmBulkDownloads(packages, options?)`

Fetches download counts for multiple packages in a single request (max 128 packages).

```tsx
const { data } = useNpmBulkDownloads(['react', 'vue', 'angular']);

console.log(data?.['react'].downloads); // 18591460
console.log(data?.['vue'].downloads);   // 4200000
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `period` | `NpmDownloadPeriod` | `'last-month'` | Same periods as `useNpmPackageDownloads` |
| `enabled` | `boolean` | `true` | Disabled when `packages` is empty |

---

### `useNpmAudit()`

Runs a full security audit against the npm registry. Accepts a lock-file-shaped payload and returns detailed advisory objects with recommended actions.

Returns a `UseMutationResult` — call `mutate(payload)` or `mutateAsync(payload)` to trigger the audit.

```tsx
const { mutate, data, isPending } = useNpmAudit();

function handleAudit() {
  mutate({
    name: 'my-app',
    version: '1.0.0',
    requires: { lodash: '^4.17.11' },
    dependencies: {
      lodash: { version: '4.17.11', integrity: 'sha512-...' },
    },
  });
}

console.log(data?.metadata.vulnerabilities);
// { info: 0, low: 0, moderate: 1, high: 0, critical: 0 }
```

---

### `useNpmAuditQuick()`

Same as `useNpmAudit` but returns only vulnerability counts by severity — no advisory details or actions. Faster and lighter.

```tsx
const { mutate, data } = useNpmAuditQuick();

mutate({ name: 'my-app', version: '1.0.0', dependencies: { /* ... */ } });

const { high, critical } = data?.metadata.vulnerabilities ?? {};
if ((high ?? 0) + (critical ?? 0) > 0) {
  console.error('Critical vulnerabilities found!');
}
```

---

### `useNpmMaintainerAvatar(username)`

Returns the public avatar URL for an npm user. No API call is made — the URL is derived from the username.

```tsx
const avatarUrl = useNpmMaintainerAvatar('sindresorhus');
// 'https://www.npmjs.com/npm-avatar/sindresorhus'

return <img src={avatarUrl} alt="sindresorhus" />;
```

---

### `useNpmMaintainer(username)`

Fetches the public profile of an npm user. No authentication required.

```tsx
const { data: user } = useNpmMaintainer('sindresorhus');

console.log(user?.name, user?.email);
```

> Throws `NpmApiError(404)` if the user has no published packages.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `username` is empty |

---

### `useNpmMaintainerPackages(username, options?)`

Searches for all packages published by a user, with pagination support.

```tsx
const { data } = useNpmMaintainerPackages('sindresorhus', { size: 25, from: 0 });

console.log(`${data?.total} packages`);
data?.objects.forEach(o => console.log(o.package.name, o.package.version));
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `size` | `number` | `20` | Results per page (max 250) |
| `from` | `number` | `0` | Pagination offset |
| `quality` | `number` | — | Scoring weight 0–1 |
| `popularity` | `number` | — | Scoring weight 0–1 |
| `maintenance` | `number` | — | Scoring weight 0–1 |
| `enabled` | `boolean` | `true` | Disabled when `username` is empty |

---

### `useNpmSearch(text, options?)`

Full-text search across the npm registry.

```tsx
const { data } = useNpmSearch('react state management', { size: 10 });

data?.objects.forEach(o => {
  console.log(o.package.name, o.score.final);
});
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `size` | `number` | `20` | Results per page (max 250) |
| `from` | `number` | `0` | Pagination offset |
| `quality` | `number` | — | Scoring weight 0–1 |
| `popularity` | `number` | — | Scoring weight 0–1 |
| `maintenance` | `number` | — | Scoring weight 0–1 |
| `enabled` | `boolean` | `true` | Disabled when `text` is empty |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
