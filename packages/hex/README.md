# @api-hooks/hex

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the [Hex.pm REST API](https://hex.pm/api), built on [`hex-api-client`](https://www.npmjs.com/package/hex-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/hex)](https://www.npmjs.com/package/@api-hooks/hex)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/hex)](https://www.npmjs.com/package/@api-hooks/hex)
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
npm install @api-hooks/hex @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` and a `HexClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HexClientProvider } from '@api-hooks/hex';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HexClientProvider>
        <YourApp />
      </HexClientProvider>
    </QueryClientProvider>
  );
}
```

By default, requests go to `hex.pm/api`. To point at a self-hosted Hex.pm instance, pass `baseUrl` through `HexClientProvider`:

```tsx
<HexClientProvider options={{ baseUrl: 'https://my-hex.example.com/api' }}>
  <YourApp />
</HexClientProvider>
```

`HexClientProvider` is optional — hooks fall back to a default `HexClient` (pointed at `hex.pm/api`) when no provider is present.

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more. `useHexPackagesInfinite` returns a [`UseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useHexPackage(name, options?)`](#usehexpackagename-options) | Full package metadata | `HexPackage` |
| [`useHexPackageVersions(name, options?)`](#usehexpackageversionsname-options) | All published versions of a package | `string[]` |
| [`useHexPackageRelease(name, version, options?)`](#usehexpackagereleasename-version-options) | Full release metadata for a version | `HexRelease` |
| [`useHexPackageLatestStable(name, options?)`](#usehexpackagelateststablename-options) | Latest stable version string | `string \| null` |
| [`useHexPackages(params?, options?)`](#usehexpackagesparams-options) | List/search Hex.pm packages | `HexPackage[]` |
| [`useHexPackagesInfinite(options?)`](#usehexpackagesinfiniteoptions) | Infinite-scroll variant of `useHexPackages` | `InfiniteData<HexPackage[]>` |

---

## API Reference

### `useHexPackage(name, options?)`

Fetches full package metadata from Hex.pm.

```tsx
import { useHexPackage } from '@api-hooks/hex';

function PackageDetail() {
  const { data } = useHexPackage('phoenix');

  return <p>{data?.meta.description}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useHexPackageVersions(name, options?)`

Fetches all published version strings of a Hex.pm package.

```tsx
import { useHexPackageVersions } from '@api-hooks/hex';

function VersionList() {
  const { data } = useHexPackageVersions('phoenix');

  return <ul>{data?.map(v => <li key={v}>{v}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useHexPackageRelease(name, version, options?)`

Fetches full release metadata for a specific package version.

```tsx
import { useHexPackageRelease } from '@api-hooks/hex';

function ReleaseDetail() {
  const { data } = useHexPackageRelease('phoenix', '1.7.10');

  return <p>{data?.meta.elixir}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useHexPackageLatestStable(name, options?)`

Fetches the `latest_stable_version` string for a Hex.pm package.

```tsx
import { useHexPackageLatestStable } from '@api-hooks/hex';

function LatestVersion() {
  const { data } = useHexPackageLatestStable('phoenix');

  return <p>Latest: {data}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useHexPackages(params?, options?)`

Lists or searches Hex.pm packages.

```tsx
import { useHexPackages } from '@api-hooks/hex';

function PackageSearch() {
  const { data, isLoading } = useHexPackages({ search: 'phoenix', per_page: 10 });

  if (isLoading) return <p>Loading…</p>;

  return <ul>{data?.map(p => <li key={p.name}>{p.name}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useHexPackagesInfinite(options?)`

Infinite-scroll variant of `useHexPackages`. Each page advances the 1-based `page` number. Hex.pm's list endpoint returns no total count, so `hasNextPage` is derived heuristically: a full page (`length === per_page`) implies more results may exist. Call `fetchNextPage()` to load the next batch — results accumulate in `data.pages`.

```tsx
import { useHexPackagesInfinite } from '@api-hooks/hex';

function PackageSearchInfinite() {
  const { data, fetchNextPage, hasNextPage } = useHexPackagesInfinite({ search: 'ecto' });

  return (
    <>
      {data?.pages.flat().map(p => <div key={p.name}>{p.name}</div>)}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `search` | `string` | `undefined` | Search text |
| `per_page` | `number` | `10` | Page size |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `InfiniteQueryOverrides<TData>` | `undefined` | Override TanStack Query options |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
