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

All hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more.

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

### Maintainer hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useNpmMaintainer(username)`](#usenpmmaIntainerusername) | Public profile of an npm user | `NpmUser` |
| [`useNpmMaintainerPackages(username, options?)`](#usenpmmaintainerpackagesusername-options) | Packages published by a user | `NpmSearchResult` |

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
