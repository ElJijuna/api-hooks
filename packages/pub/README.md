# @api-hooks/pub

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the [pub.dev REST API](https://pub.dev), built on [`pub-api-client`](https://www.npmjs.com/package/pub-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/pub)](https://www.npmjs.com/package/@api-hooks/pub)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/pub)](https://www.npmjs.com/package/@api-hooks/pub)
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
npm install @api-hooks/pub @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` and a `PubClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PubClientProvider } from '@api-hooks/pub';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PubClientProvider>
        <YourApp />
      </PubClientProvider>
    </QueryClientProvider>
  );
}
```

By default, requests go to `pub.dev`. To point at a private/mirrored pub registry, pass `baseUrl` through `PubClientProvider`:

```tsx
<PubClientProvider options={{ baseUrl: 'https://my-pub-mirror.example.com' }}>
  <YourApp />
</PubClientProvider>
```

`PubClientProvider` is optional — hooks fall back to a default `PubClient` (pointed at `pub.dev`) when no provider is present.

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more. `usePubSearchInfinite` returns a [`UseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`usePubPackageInfo(name, options?)`](#usepubpackageinfoname-options) | Full package info: latest + all versions | `PubPackageInfo` |
| [`usePubPackageVersions(name, options?)`](#usepubpackageversionsname-options) | All published versions of a package | `PubVersionInfo[]` |
| [`usePubPackageVersion(name, version, options?)`](#usepubpackageversionname-version-options) | Metadata for a specific version | `PubVersionInfo` |
| [`usePubPackageLatest(name, options?)`](#usepubpackagelatestname-options) | Metadata for the latest version | `PubVersionInfo` |
| [`usePubPackageScore(name, options?)`](#usepubpackagescorename-options) | Pub points, likes, popularity score | `PubPackageScore` |
| [`usePubSearch(params?, options?)`](#usepubsearchparams-options) | Search pub.dev packages | `PubSearchResult` |
| [`usePubSearchInfinite(options?)`](#usepubsearchinfiniteoptions) | Infinite-scroll variant of `usePubSearch` | `InfiniteData<PubSearchResult>` |

---

## API Reference

### `usePubPackageInfo(name, options?)`

Fetches full pub.dev package info, including latest version and all published versions.

```tsx
import { usePubPackageInfo } from '@api-hooks/pub';

function PackageDetail() {
  const { data } = usePubPackageInfo('http');

  return <p>Latest: {data?.latest.version}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePubPackageVersions(name, options?)`

Fetches all published versions of a pub.dev package.

```tsx
import { usePubPackageVersions } from '@api-hooks/pub';

function VersionList() {
  const { data } = usePubPackageVersions('http');

  return <ul>{data?.map(v => <li key={v.version}>{v.version}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePubPackageVersion(name, version, options?)`

Fetches metadata for a specific published version of a pub.dev package.

```tsx
import { usePubPackageVersion } from '@api-hooks/pub';

function VersionDetail() {
  const { data } = usePubPackageVersion('http', '1.2.2');

  return <p>Published: {data?.published}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePubPackageLatest(name, options?)`

Fetches metadata for the latest published version of a pub.dev package.

```tsx
import { usePubPackageLatest } from '@api-hooks/pub';

function LatestVersion() {
  const { data } = usePubPackageLatest('http');

  return <p>Latest: {data?.version}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePubPackageScore(name, options?)`

Fetches pub points, likes, and popularity score for a package.

```tsx
import { usePubPackageScore } from '@api-hooks/pub';

function ScoreBadge() {
  const { data } = usePubPackageScore('http');

  return <p>{data?.grantedPoints} / {data?.maxPoints} pub points</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePubSearch(params?, options?)`

Searches pub.dev packages by text.

```tsx
import { usePubSearch } from '@api-hooks/pub';

function PackageSearch() {
  const { data, isLoading } = usePubSearch({ query: 'http client' });

  if (isLoading) return <p>Loading…</p>;

  return <ul>{data?.packages.map(p => <li key={p.package}>{p.package}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePubSearchInfinite(options?)`

Infinite-scroll variant of `usePubSearch`. Each page advances the 1-based `page` number; continues while `lastPage.next` is present. Call `fetchNextPage()` to load the next batch — results accumulate in `data.pages`.

```tsx
import { usePubSearchInfinite } from '@api-hooks/pub';

function PackageSearchInfinite() {
  const { data, fetchNextPage, hasNextPage } = usePubSearchInfinite({ query: 'json' });

  return (
    <>
      {data?.pages.flatMap(page => page.packages).map(p => (
        <div key={p.package}>{p.package}</div>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `query` | `string` | `undefined` | Search text |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `InfiniteQueryOverrides<TData>` | `undefined` | Override TanStack Query options |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
