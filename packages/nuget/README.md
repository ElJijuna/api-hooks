# @api-hooks/nuget

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the [NuGet REST API](https://learn.microsoft.com/en-us/nuget/api/overview), built on [`nuget-api-client`](https://www.npmjs.com/package/nuget-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/nuget)](https://www.npmjs.com/package/@api-hooks/nuget)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/nuget)](https://www.npmjs.com/package/@api-hooks/nuget)
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
npm install @api-hooks/nuget @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` and a `NuGetClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuGetClientProvider } from '@api-hooks/nuget';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuGetClientProvider>
        <YourApp />
      </NuGetClientProvider>
    </QueryClientProvider>
  );
}
```

By default, requests go to `nuget.org` (`api.nuget.org` / `azuresearch-usnc.nuget.org`). To point at a private feed (Azure Artifacts, GitHub Packages, etc.), pass `registryUrl`/`searchUrl`/`apiKey` through `NuGetClientProvider`:

```tsx
<NuGetClientProvider
  options={{
    registryUrl: 'https://my-feed.example.com',
    searchUrl: 'https://my-feed.example.com/search',
    apiKey: 'my-api-key',
  }}
>
  <YourApp />
</NuGetClientProvider>
```

`NuGetClientProvider` is optional — hooks fall back to a default `NuGetClient` (pointed at `nuget.org`) when no provider is present.

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more. `useNuGetSearchInfinite` returns a [`UseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useNuGetSearch(params?, options?)`](#usenugetsearchparams-options) | Search NuGet packages | `NuGetSearchResult` |
| [`useNuGetSearchInfinite(options?)`](#usenugetsearchinfiniteoptions) | Infinite-scroll variant of `useNuGetSearch` | `InfiniteData<NuGetSearchResult>` |
| [`useNuGetAutocomplete(params?, options?)`](#usenugetautocompleteparams-options) | Autocomplete package IDs | `NuGetAutocompleteResult` |
| [`useNuGetPackageVersions(id, options?)`](#usenugetpackageversionsid-options) | All published versions of a package | `string[]` |
| [`useNuGetPackageVersion(id, version, options?)`](#usenugetpackageversionid-version-options) | Catalog entry for a specific version | `NuGetCatalogEntry` |
| [`useNuGetPackageLatest(id, options?)`](#usenugetpackagelatestid-options) | Catalog entry for the latest listed version | `NuGetCatalogEntry` |

---

## API Reference

### `useNuGetSearch(params?, options?)`

Searches NuGet packages using the NuGet Search Query Service.

```tsx
import { useNuGetSearch } from '@api-hooks/nuget';

function PackageSearch() {
  const { data, isLoading } = useNuGetSearch({ query: 'json serializer', take: 10 });

  if (isLoading) return <p>Loading…</p>;

  return (
    <ul>
      {data?.data.map(pkg => (
        <li key={pkg.id}>{pkg.id} — {pkg.version} ({pkg.totalDownloads} downloads)</li>
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

### `useNuGetSearchInfinite(options?)`

Infinite-scroll variant of `useNuGetSearch`. Each page is fetched by advancing the `skip` offset by `take`. Call `fetchNextPage()` to load the next batch — results accumulate in `data.pages`.

```tsx
import { useNuGetSearchInfinite } from '@api-hooks/nuget';

function PackageSearchInfinite() {
  const { data, fetchNextPage, hasNextPage } = useNuGetSearchInfinite({ query: 'logging' });

  return (
    <>
      {data?.pages.flatMap(page => page.data).map(pkg => (
        <div key={pkg.id}>{pkg.id}</div>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `query` | `string` | `undefined` | Search query |
| `take` | `number` | `20` | Page size |
| `prerelease` | `boolean` | `false` | Include prerelease versions |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `InfiniteQueryOverrides<TData>` | `undefined` | Override TanStack Query options |

---

### `useNuGetAutocomplete(params?, options?)`

Autocompletes NuGet package IDs by prefix.

```tsx
import { useNuGetAutocomplete } from '@api-hooks/nuget';

function PackageAutocomplete({ q }: { q: string }) {
  const { data } = useNuGetAutocomplete({ q });

  return <ul>{data?.data.map(id => <li key={id}>{id}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useNuGetPackageVersions(id, options?)`

Fetches all published versions of a NuGet package, ordered oldest → newest.

```tsx
import { useNuGetPackageVersions } from '@api-hooks/nuget';

function VersionList() {
  const { data } = useNuGetPackageVersions('Newtonsoft.Json');

  return <ul>{data?.map(v => <li key={v}>{v}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `id` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useNuGetPackageVersion(id, version, options?)`

Fetches the catalog entry (metadata) for a specific published version of a NuGet package.

```tsx
import { useNuGetPackageVersion } from '@api-hooks/nuget';

function VersionDetail() {
  const { data } = useNuGetPackageVersion('Newtonsoft.Json', '13.0.3');

  return <p>{data?.authors} — {data?.published}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `id` or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useNuGetPackageLatest(id, options?)`

Fetches the catalog entry for the latest listed (stable) version of a NuGet package.

```tsx
import { useNuGetPackageLatest } from '@api-hooks/nuget';

function LatestVersion() {
  const { data } = useNuGetPackageLatest('Newtonsoft.Json');

  return <p>Latest: {data?.version}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `id` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
