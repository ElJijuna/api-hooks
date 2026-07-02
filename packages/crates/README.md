# @api-hooks/crates

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the [crates.io REST API](https://crates.io/data-access), built on [`crates-api-client`](https://www.npmjs.com/package/crates-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/crates)](https://www.npmjs.com/package/@api-hooks/crates)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/crates)](https://www.npmjs.com/package/@api-hooks/crates)
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
npm install @api-hooks/crates @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` and a `CratesClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CratesClientProvider } from '@api-hooks/crates';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CratesClientProvider>
        <YourApp />
      </CratesClientProvider>
    </QueryClientProvider>
  );
}
```

By default, requests go to `crates.io`. crates.io requires a descriptive `User-Agent` header for server-side requests — override it (or point at a private/mirrored registry) through `CratesClientProvider`:

```tsx
<CratesClientProvider
  options={{
    baseUrl: 'https://my-registry.example.com',
    userAgent: 'my-app/1.0 (contact@example.com)',
  }}
>
  <YourApp />
</CratesClientProvider>
```

`CratesClientProvider` is optional — hooks fall back to a default `CratesClient` (pointed at `crates.io`) when no provider is present.

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more. `useCratesSearchInfinite` returns a [`UseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useCratesSearch(params?, options?)`](#usecratessearchparams-options) | Search crates.io | `CratesSearchResult` |
| [`useCratesSearchInfinite(options?)`](#usecratessearchinfiniteoptions) | Infinite-scroll variant of `useCratesSearch` | `InfiniteData<CratesSearchResult>` |
| [`useCratesCrateSummary(name, options?)`](#usecratescratesummaryname-options) | Crate metadata plus versions, keywords, categories | `CrateResult` |
| [`useCratesCrateVersions(name, options?)`](#usecratescrateversionsname-options) | All published versions of a crate | `CrateVersion[]` |
| [`useCratesCrateVersion(name, version, options?)`](#usecratescrateversionname-version-options) | Metadata for a specific version | `CrateVersion` |
| [`useCratesCrateLatest(name, options?)`](#usecratescratelatestname-options) | Metadata for the latest (`max_version`) release | `CrateVersion` |

---

## API Reference

### `useCratesSearch(params?, options?)`

Searches crates.io by text, with pagination and sort order.

```tsx
import { useCratesSearch } from '@api-hooks/crates';

function CrateSearch() {
  const { data, isLoading } = useCratesSearch({ query: 'serde', perPage: 10 });

  if (isLoading) return <p>Loading…</p>;

  return (
    <ul>
      {data?.crates.map(c => (
        <li key={c.id}>{c.name} — {c.max_version} ({c.downloads} downloads)</li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useCratesSearchInfinite(options?)`

Infinite-scroll variant of `useCratesSearch`. Each page is fetched by advancing the 1-based `page` number. Call `fetchNextPage()` to load the next batch — results accumulate in `data.pages`.

```tsx
import { useCratesSearchInfinite } from '@api-hooks/crates';

function CrateSearchInfinite() {
  const { data, fetchNextPage, hasNextPage } = useCratesSearchInfinite({ query: 'serialization' });

  return (
    <>
      {data?.pages.flatMap(page => page.crates).map(c => (
        <div key={c.id}>{c.name}</div>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `query` | `string` | `undefined` | Search text |
| `perPage` | `number` | `10` | Page size |
| `sort` | `CratesSort` | `undefined` | Sort order (`'alpha'`, `'downloads'`, `'recent-downloads'`, `'recent-updates'`, `'new'`) |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `InfiniteQueryOverrides<TData>` | `undefined` | Override TanStack Query options |

---

### `useCratesCrateSummary(name, options?)`

Fetches crate metadata plus its included versions, keywords, and categories.

```tsx
import { useCratesCrateSummary } from '@api-hooks/crates';

function CrateDetail() {
  const { data } = useCratesCrateSummary('serde');

  return <p>{data?.crate.description}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useCratesCrateVersions(name, options?)`

Fetches all versions published for a crate.

```tsx
import { useCratesCrateVersions } from '@api-hooks/crates';

function VersionList() {
  const { data } = useCratesCrateVersions('serde');

  return <ul>{data?.map(v => <li key={v.num}>{v.num}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useCratesCrateVersion(name, version, options?)`

Fetches metadata for a specific published version of a crate.

```tsx
import { useCratesCrateVersion } from '@api-hooks/crates';

function VersionDetail() {
  const { data } = useCratesCrateVersion('serde', '1.0.210');

  return <p>{data?.license} — {data?.downloads} downloads</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useCratesCrateLatest(name, options?)`

Fetches version metadata matching the crate's `max_version` (the latest non-yanked version).

```tsx
import { useCratesCrateLatest } from '@api-hooks/crates';

function LatestVersion() {
  const { data } = useCratesCrateLatest('serde');

  return <p>Latest: {data?.num}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
