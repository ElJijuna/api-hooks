# @api-hooks/maven

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the [Maven Central REST API](https://search.maven.org), built on [`maven-api-client`](https://www.npmjs.com/package/maven-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/maven)](https://www.npmjs.com/package/@api-hooks/maven)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/maven)](https://www.npmjs.com/package/@api-hooks/maven)
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
npm install @api-hooks/maven @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` and a `MavenClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MavenClientProvider } from '@api-hooks/maven';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MavenClientProvider>
        <YourApp />
      </MavenClientProvider>
    </QueryClientProvider>
  );
}
```

By default, requests go to Maven Central (`search.maven.org`). To point at a private Nexus/Artifactory mirror, pass a `baseUrl` through `MavenClientProvider`:

```tsx
<MavenClientProvider options={{ baseUrl: 'https://my-nexus.example.com' }}>
  <YourApp />
</MavenClientProvider>
```

`MavenClientProvider` is optional — hooks fall back to a default `MavenClient` (pointed at Maven Central) when no provider is present.

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more. `useMavenSearchInfinite` returns a [`UseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery).

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useMavenSearch(params, options?)`](#usemavensearchparams-options) | Search Maven Central artifacts | `MavenSearchResult` |
| [`useMavenSearchInfinite(options?)`](#usemavensearchinfiniteoptions) | Infinite-scroll variant of `useMavenSearch` | `InfiniteData<MavenSearchResult>` |
| [`useMavenSuggest(params, options?)`](#usemavensuggestparams-options) | Prefix/keyword suggestions for artifacts | `MavenSearchResult` |
| [`useMavenArtifactVersions(groupId, artifactId, options?)`](#usemavenartifactversionsgroupid-artifactid-options) | All published versions of an artifact | `string[]` |
| [`useMavenArtifactVersion(groupId, artifactId, version, options?)`](#usemavenartifactversiongroupid-artifactid-version-options) | Metadata for a specific version | `MavenVersionDoc` |
| [`useMavenArtifactLatest(groupId, artifactId, options?)`](#usemavenartifactlatestgroupid-artifactid-options) | Metadata for the latest version | `MavenVersionDoc` |

---

## API Reference

### `useMavenSearch(params, options?)`

Searches Maven Central artifacts by group ID, artifact ID, class name, or free text.

```tsx
import { useMavenSearch } from '@api-hooks/maven';

function ArtifactSearch() {
  const { data, isLoading } = useMavenSearch({ query: 'g:org.springframework a:spring-core' });

  if (isLoading) return <p>Loading…</p>;

  return (
    <ul>
      {data?.response.docs.map(doc => (
        <li key={doc.id}>{doc.id} — {doc.latestVersion}</li>
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

### `useMavenSearchInfinite(options?)`

Infinite-scroll variant of `useMavenSearch`. Each page is fetched by advancing the `start` offset by `rows`. Call `fetchNextPage()` to load the next batch — results accumulate in `data.pages`.

```tsx
import { useMavenSearchInfinite } from '@api-hooks/maven';

function ArtifactSearchInfinite() {
  const { data, fetchNextPage, hasNextPage } = useMavenSearchInfinite({ query: 'spring' });

  return (
    <>
      {data?.pages.flatMap(page => page.response.docs).map(doc => (
        <div key={doc.id}>{doc.id}</div>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load more</button>}
    </>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `query` | `string` | `undefined` | Search query |
| `rows` | `number` | `20` | Page size |
| `enabled` | `boolean` | `true` | Disable the query |
| `queryOptions` | `InfiniteQueryOverrides<TData>` | `undefined` | Override TanStack Query options |

---

### `useMavenSuggest(params, options?)`

Suggests Maven Central artifacts for prefix or keyword matching. The query is automatically disabled when `query` is empty.

```tsx
import { useMavenSuggest } from '@api-hooks/maven';

function ArtifactAutocomplete({ query }: { query: string }) {
  const { data } = useMavenSuggest({ query });

  return (
    <ul>
      {data?.response.docs.map(doc => (
        <li key={doc.id}>{doc.id}</li>
      ))}
    </ul>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `query` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useMavenArtifactVersions(groupId, artifactId, options?)`

Fetches all published versions of a Maven Central artifact.

```tsx
import { useMavenArtifactVersions } from '@api-hooks/maven';

function VersionList() {
  const { data } = useMavenArtifactVersions('org.springframework', 'spring-core');

  return <ul>{data?.map(v => <li key={v}>{v}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `groupId` or `artifactId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useMavenArtifactVersion(groupId, artifactId, version, options?)`

Fetches metadata for a specific published version of a Maven Central artifact.

```tsx
import { useMavenArtifactVersion } from '@api-hooks/maven';

function VersionDetail() {
  const { data } = useMavenArtifactVersion('org.springframework', 'spring-core', '6.1.0');

  return <p>{data?.p} — {data?.timestamp}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `groupId`, `artifactId`, or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `useMavenArtifactLatest(groupId, artifactId, options?)`

Fetches metadata for the latest published version of a Maven Central artifact.

```tsx
import { useMavenArtifactLatest } from '@api-hooks/maven';

function LatestVersion() {
  const { data } = useMavenArtifactLatest('org.springframework', 'spring-core');

  return <p>Latest: {data?.v}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `groupId` or `artifactId` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
