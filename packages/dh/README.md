# @api-hooks/dh

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the [Docker Hub API](https://docs.docker.com/reference/api/hub/latest/), built on [`dockerhub-api-client`](https://www.npmjs.com/package/dockerhub-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/dh)](https://www.npmjs.com/package/@api-hooks/dh)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/dh)](https://www.npmjs.com/package/@api-hooks/dh)
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
npm install @api-hooks/dh @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DhClientProvider } from '@api-hooks/dh';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DhClientProvider>
        <YourApp />
      </DhClientProvider>
    </QueryClientProvider>
  );
}
```

For authenticated requests, obtain a token via `useDockerHubLogin` and pass it through `DhClientProvider`:

```tsx
<DhClientProvider options={{ token: 'your-jwt-token' }}>
  <YourApp />
</DhClientProvider>
```

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more.

`useDockerHubLogin` returns a [`UseMutationResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) since it performs a POST request.

### Repository hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useDockerHubRepository(namespace, name)`](#usedockerhubrepositoynamespace-name) | Repository metadata | `DockerHubRepository` |
| [`useDockerHubRepositoryTags(namespace, name, options?)`](#usedockerhubrepositorytagnamespacename-options) | Image tags for a repository | `DockerHubPagedResponse<DockerHubTag>` |
| `useDockerHubRepositoryTagsInfinite(namespace, name, options?)` | Infinite-scroll variant of `useDockerHubRepositoryTags` | `InfiniteData<DockerHubPagedResponse<DockerHubTag>>` |

### User hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useDockerHubUser(username)`](#usedockerhubuserusername) | Public user profile | `DockerHubUser` |
| [`useDockerHubUserRepositories(username, options?)`](#usedockerhubuser repositoriesusername-options) | Public repositories of a user | `DockerHubPagedResponse<DockerHubRepository>` |
| `useDockerHubUserRepositoriesInfinite(username, options?)` | Infinite-scroll variant of `useDockerHubUserRepositories` | `InfiniteData<DockerHubPagedResponse<DockerHubRepository>>` |

### Organization hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useDockerHubOrg(orgname)`](#usedockerhuborgorgname) | Organization profile | `DockerHubOrganization` |

### Search hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useDockerHubSearch(query, options?)`](#usedockerhuabsearchquery-options) | Search repositories on Docker Hub | `DockerHubPagedResponse<DockerHubSearchResult>` |
| `useDockerHubSearchInfinite(query, options?)` | Infinite-scroll variant of `useDockerHubSearch` | `InfiniteData<DockerHubPagedResponse<DockerHubSearchResult>>` |

### Auth hooks

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useDockerHubLogin()`](#usedockerhublogin) | Authenticate and obtain a JWT token (POST) | `string` |

---

## API Reference

### `useDockerHubRepository(namespace, name)`

Fetches metadata for a Docker Hub image repository. For official images use `'library'` as namespace.

```tsx
import { useDockerHubRepository } from '@api-hooks/dh';

function RepoInfo() {
  const { data, isLoading, isError } = useDockerHubRepository('library', 'nginx');

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Not found.</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Pulls: {data.pull_count.toLocaleString()}</p>
      <p>Stars: {data.star_count}</p>
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `namespace` or `name` is empty |

---

### `useDockerHubRepositoryTags(namespace, name, options?)`

Lists image tags for a Docker Hub repository, with optional filtering by name prefix.

```tsx
const { data } = useDockerHubRepositoryTags('library', 'nginx', { page_size: 10 });

data?.results.forEach(tag => console.log(tag.name, tag.digest));

// Filter by name prefix
const { data: stable } = useDockerHubRepositoryTags('library', 'nginx', { name: 'stable' });
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `page` | `number` | — | Page number |
| `page_size` | `number` | — | Results per page |
| `name` | `string` | — | Filter tags by name prefix |
| `ordering` | `string` | — | Sort order |
| `enabled` | `boolean` | `true` | Disabled when `namespace` or `name` is empty |

---

### `useDockerHubRepositoryTagsInfinite(namespace, name, options?)`

Infinite-scroll variant of `useDockerHubRepositoryTags`. Call `fetchNextPage()` to load the next page.

```tsx
import { useDockerHubRepositoryTagsInfinite } from '@api-hooks/dh';

function TagList({ namespace, name }: { namespace: string; name: string }) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useDockerHubRepositoryTagsInfinite(namespace, name, { page_size: 10 });

  const allTags = data?.pages.flatMap(p => p.results) ?? [];

  return (
    <>
      <ul>
        {allTags.map(tag => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load more
        </button>
      )}
    </>
  );
}
```

---

### `useDockerHubUser(username)`

Fetches the public profile of a Docker Hub user.

```tsx
const { data } = useDockerHubUser('johndoe');

console.log(data?.full_name);    // 'John Doe'
console.log(data?.gravatar_url); // 'https://...'
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `username` is empty |

---

### `useDockerHubUserRepositories(username, options?)`

Lists public repositories owned by a Docker Hub user.

```tsx
const { data } = useDockerHubUserRepositories('johndoe', { page_size: 25 });

data?.results.forEach(r => console.log(r.name, r.pull_count));
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `page` | `number` | — | Page number |
| `page_size` | `number` | — | Results per page |
| `ordering` | `string` | — | Sort order |
| `enabled` | `boolean` | `true` | Disabled when `username` is empty |

---

### `useDockerHubUserRepositoriesInfinite(username, options?)`

Infinite-scroll variant of `useDockerHubUserRepositories`.

```tsx
const { data, hasNextPage, fetchNextPage } =
  useDockerHubUserRepositoriesInfinite('johndoe', { page_size: 10 });

const allRepos = data?.pages.flatMap(p => p.results) ?? [];
```

---

### `useDockerHubOrg(orgname)`

Fetches a Docker Hub organization's profile.

```tsx
const { data } = useDockerHubOrg('docker');

console.log(data?.full_name); // 'Docker'
console.log(data?.type);      // 'Organization'
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `orgname` is empty |

---

### `useDockerHubSearch(query, options?)`

Searches for repositories on Docker Hub.

```tsx
const { data } = useDockerHubSearch('nginx', { page_size: 10 });

data?.results.forEach(r => {
  console.log(r.repo_name, r.pull_count, r.is_official);
});
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `page` | `number` | — | Page number |
| `page_size` | `number` | — | Results per page |
| `type` | `'image'` | — | Filter by content type |
| `enabled` | `boolean` | `true` | Disabled when `query` is empty |

---

### `useDockerHubSearchInfinite(query, options?)`

Infinite-scroll variant of `useDockerHubSearch`.

```tsx
import { useDockerHubSearchInfinite } from '@api-hooks/dh';

function InfiniteSearch() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useDockerHubSearchInfinite('nginx', { page_size: 10 });

  const allResults = data?.pages.flatMap(p => p.results) ?? [];

  return (
    <>
      <ul>
        {allResults.map(r => (
          <li key={r.repo_name}>{r.repo_name}</li>
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load more
        </button>
      )}
    </>
  );
}
```

---

### `useDockerHubLogin()`

Authenticates against Docker Hub and returns a JWT token. Pass the token to `DhClientProvider` for subsequent authenticated requests.

Returns a `UseMutationResult` — call `mutate({ username, password })` to trigger.

```tsx
import { useState } from 'react';
import { useDockerHubLogin } from '@api-hooks/dh';

function LoginForm() {
  const { mutate, isPending, isError } = useDockerHubLogin();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    mutate(
      { username: form.get('username') as string, password: form.get('password') as string },
      { onSuccess: (token) => console.log('Token:', token) },
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <input name="password" type="password" />
      <button type="submit" disabled={isPending}>Login</button>
      {isError && <p>Invalid credentials.</p>}
    </form>
  );
}
```

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
