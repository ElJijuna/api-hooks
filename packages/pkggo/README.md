# @api-hooks/pkggo

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the [Go module proxy](https://go.dev/ref/mod#goproxy-protocol) and [pkg.go.dev](https://pkg.go.dev), built on [`pkggo-api-client`](https://www.npmjs.com/package/pkggo-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/pkggo)](https://www.npmjs.com/package/@api-hooks/pkggo)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/pkggo)](https://www.npmjs.com/package/@api-hooks/pkggo)
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
npm install @api-hooks/pkggo @tanstack/react-query
```

## Setup

Wrap your application with a `QueryClientProvider` and a `PkgGoClientProvider` once at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PkgGoClientProvider } from '@api-hooks/pkggo';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PkgGoClientProvider>
        <YourApp />
      </PkgGoClientProvider>
    </QueryClientProvider>
  );
}
```

By default, requests go to `proxy.golang.org` (docs links point at `pkg.go.dev`). To point at a private module proxy (e.g. Athens, GOPROXY mirror), pass `proxyUrl`/`pkgGoDevUrl` through `PkgGoClientProvider`:

```tsx
<PkgGoClientProvider
  options={{
    proxyUrl: 'https://my-goproxy.example.com',
    pkgGoDevUrl: 'https://my-docs.example.com',
  }}
>
  <YourApp />
</PkgGoClientProvider>
```

`PkgGoClientProvider` is optional — hooks fall back to a default `PkgGoClient` (pointed at `proxy.golang.org`) when no provider is present.

## Hooks

Query hooks return a [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) — you get the full TanStack Query API: `data`, `isLoading`, `isFetching`, `isError`, `error`, `refetch`, and more.

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`usePkgGoModuleLatest(modulePath, options?)`](#usepkggomodulelatestmodulepath-options) | Latest module info | `GoModuleInfo` |
| [`usePkgGoModuleVersions(modulePath, options?)`](#usepkggomoduleversionsmodulepath-options) | All known module versions | `string[]` |
| [`usePkgGoVersionInfo(modulePath, version, options?)`](#usepkggoversioninfomodulepath-version-options) | Metadata for a specific version | `GoModuleInfo` |
| [`usePkgGoVersionMod(modulePath, version, options?)`](#usepkggoversionmodmodulepath-version-options) | Raw `go.mod` file contents | `string` |
| [`usePkgGoVersionZip(modulePath, version, options?)`](#usepkggoversionzipmodulepath-version-options) | Module zip archive bytes | `ArrayBuffer` |

---

## API Reference

### `usePkgGoModuleLatest(modulePath, options?)`

Fetches the latest module info from the Go module proxy `@latest` endpoint.

```tsx
import { usePkgGoModuleLatest } from '@api-hooks/pkggo';

function LatestVersion() {
  const { data } = usePkgGoModuleLatest('golang.org/x/mod');

  return <p>Latest: {data?.Version}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `modulePath` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePkgGoModuleVersions(modulePath, options?)`

Lists module versions known by the configured Go module proxy.

```tsx
import { usePkgGoModuleVersions } from '@api-hooks/pkggo';

function VersionList() {
  const { data } = usePkgGoModuleVersions('golang.org/x/mod');

  return <ul>{data?.map(v => <li key={v}>{v}</li>)}</ul>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `modulePath` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePkgGoVersionInfo(modulePath, version, options?)`

Fetches metadata for a specific module version.

```tsx
import { usePkgGoVersionInfo } from '@api-hooks/pkggo';

function VersionDetail() {
  const { data } = usePkgGoVersionInfo('golang.org/x/mod', 'v0.37.0');

  return <p>Published: {data?.Time}</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `modulePath` or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePkgGoVersionMod(modulePath, version, options?)`

Fetches the raw `go.mod` file contents for a module version.

```tsx
import { usePkgGoVersionMod } from '@api-hooks/pkggo';

function GoModViewer() {
  const { data } = usePkgGoVersionMod('golang.org/x/mod', 'v0.37.0');

  return <pre>{data}</pre>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `modulePath` or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

### `usePkgGoVersionZip(modulePath, version, options?)`

Downloads the module zip archive for a version.

```tsx
import { usePkgGoVersionZip } from '@api-hooks/pkggo';

function DownloadZip() {
  const { data } = usePkgGoVersionZip('golang.org/x/mod', 'v0.37.0');

  return <p>{data?.byteLength} bytes</p>;
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `modulePath` or `version` is empty) |
| `queryOptions` | `QueryOverrides<TData>` | `undefined` | Override TanStack Query options (`staleTime`, `retry`, `gcTime`, `select`, etc.) |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
