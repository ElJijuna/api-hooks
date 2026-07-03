# @api-hooks/swiftpm

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the [Swift Package Registry](https://github.com/apple/swift-package-manager/blob/main/Documentation/PackageRegistry/Registry.md) (SE-0292) and [Swift Package Index](https://swiftpackageindex.com) APIs, built on [`swiftpm-api-client`](https://www.npmjs.com/package/swiftpm-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/swiftpm)](https://www.npmjs.com/package/@api-hooks/swiftpm)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/swiftpm)](https://www.npmjs.com/package/@api-hooks/swiftpm)
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
npm install @api-hooks/swiftpm @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` and a `SwiftPMClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SwiftPMClientProvider } from '@api-hooks/swiftpm';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SwiftPMClientProvider>
        <YourApp />
      </SwiftPMClientProvider>
    </QueryClientProvider>
  );
}
```

`useSwiftPMSearch`/`useSwiftPMSearchInfinite` call the Swift Package Index API, which requires a bearer token. Pass `indexToken` (and optionally `registryUrl`/`indexUrl` for a private registry or self-hosted index) through `SwiftPMClientProvider`:

```tsx
<SwiftPMClientProvider options={{ indexToken: 'my-spi-token' }}>
  <YourApp />
</SwiftPMClientProvider>
```

`SwiftPMClientProvider` is optional — hooks fall back to a default `SwiftPMClient` when no provider is present, but search will fail without a token.

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more. `useSwiftPMSearchInfinite` returns a [`UseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useSwiftPMPackageReleases(scope, name, options?)`](#useswiftpmpackagereleasesscope-name-options) | All published releases for a package | `SwiftReleasesIndex` |
| [`useSwiftPMPackageRelease(scope, name, version, options?)`](#useswiftpmpackagereleasescope-name-version-options) | Metadata for a specific release version | `SwiftRelease` |
| [`useSwiftPMPackageLatest(scope, name, options?)`](#useswiftpmpackagelatestscope-name-options) | Metadata for the latest release | `SwiftRelease` |
| [`useSwiftPMPackageManifest(scope, name, version, options?)`](#useswiftpmpackagemanifestscope-name-version-options) | Raw `Package.swift` manifest contents | `string` |
| [`useSwiftPMSearch(params, options?)`](#useswiftpmsearchparams-options) | Search packages via Swift Package Index | `SwiftSearchResult` |
| [`useSwiftPMSearchInfinite(query, options?)`](#useswiftpmsearchinfinitequery-options) | Infinite-scroll variant of `useSwiftPMSearch` | `InfiniteData<SwiftSearchResult>` |
| [`useSwiftPMLookupIdentifiers(repositoryURL, options?)`](#useswiftpmlookupidentifiersrepositoryurl-options) | Package identifiers for a repository URL | `SwiftIdentifiersResult` |

---

## API Reference

### `useSwiftPMPackageReleases(scope, name, options?)`

Lists all published releases for a Swift package.

```tsx
import { useSwiftPMPackageReleases } from '@api-hooks/swiftpm';

function ReleaseList() {
  const { data } = useSwiftPMPackageReleases('apple', 'swift-argument-parser');

  return <ul>{data && Object.keys(data.releases).map(v => <li key={v}>{v}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `scope` or `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useSwiftPMPackageRelease(scope, name, version, options?)`

Fetches metadata for a specific release version.

```tsx
import { useSwiftPMPackageRelease } from '@api-hooks/swiftpm';

function ReleaseDetail() {
  const { data } = useSwiftPMPackageRelease('apple', 'swift-argument-parser', '1.1.0');

  return <p>{data?.metadata.description}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `scope`, `name`, or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useSwiftPMPackageLatest(scope, name, options?)`

Fetches metadata for the latest (highest semver) release of a package.

```tsx
import { useSwiftPMPackageLatest } from '@api-hooks/swiftpm';

function LatestRelease() {
  const { data } = useSwiftPMPackageLatest('apple', 'swift-argument-parser');

  return <p>Latest: {data?.version}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `scope` or `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useSwiftPMPackageManifest(scope, name, version, options?)`

Fetches the raw `Package.swift` manifest for a specific release version.

```tsx
import { useSwiftPMPackageManifest } from '@api-hooks/swiftpm';

function ManifestViewer() {
  const { data } = useSwiftPMPackageManifest('apple', 'swift-argument-parser', '1.1.0');

  return <pre>{data}</pre>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `scope`, `name`, or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useSwiftPMSearch(params, options?)`

Searches Swift packages using the Swift Package Index API. Requires `indexToken` to be configured via `SwiftPMClientProvider`.

```tsx
import { useSwiftPMSearch } from '@api-hooks/swiftpm';

function PackageSearch() {
  const { data, isLoading } = useSwiftPMSearch({ query: 'vapor' });

  if (isLoading) return <p>Loading…</p>;

  return <ul>{data?.results.map(p => <li key={p.packageId}>{p.packageName}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `query` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useSwiftPMSearchInfinite(query, options?)`

Infinite-scroll variant of `useSwiftPMSearch`. Each page advances the 1-based `page` number; continues while `lastPage.hasMoreResults` is `true`. Call `fetchNextPage()` to load the next batch — results accumulate in `data.pages`.

```tsx
import { useSwiftPMSearchInfinite } from '@api-hooks/swiftpm';

function PackageSearchInfinite() {
  const { data, fetchNextPage, hasNextPage } = useSwiftPMSearchInfinite('vapor');

  return (
    <>
      {data?.pages.flatMap(page => page.results).map(p => (
        <div key={p.packageId}>{p.packageName}</div>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `pageSize` | `number` | `undefined` | Results per page |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `query` is empty) |
| `queryOptions` | `InfiniteQueryOverrides<TData>` | `undefined` | Override TanStack Query options |

---

### `useSwiftPMLookupIdentifiers(repositoryURL, options?)`

Looks up package identifiers by source repository URL.

```tsx
import { useSwiftPMLookupIdentifiers } from '@api-hooks/swiftpm';

function IdentifierLookup({ url }: { url: string }) {
  const { data } = useSwiftPMLookupIdentifiers(url);

  return <ul>{data?.identifiers.map(id => <li key={id}>{id}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `repositoryURL` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
