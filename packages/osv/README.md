# @api-hooks/osv

React hooks for the [OSV (Open Source Vulnerabilities) API](https://osv.dev), built on [`osv-api-client`](https://www.npmjs.com/package/osv-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/osv)](https://www.npmjs.com/package/@api-hooks/osv)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/osv)](https://www.npmjs.com/package/@api-hooks/osv)
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
npm install @api-hooks/osv osv-api-client @tanstack/react-query
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

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useOsvVuln(id, options?)`](#useosv vulnid-options) | Fetch a single vulnerability by ID | `OsvVulnerability` |
| [`useOsvQuery(params, options?)`](#useosv queryparams-options) | Query vulnerabilities by package or commit | `OsvQueryResult` |
| [`useOsvQueryBatch(queries, options?)`](#useosv querybatchqueries-options) | Batch-query vulnerabilities for multiple packages | `OsvBatchQueryResult` |

---

## API Reference

### `useOsvVuln(id, options?)`

Fetches a single vulnerability record by its OSV ID (e.g. `'GHSA-1234-5678-9012'`, `'CVE-2021-44228'`).

```tsx
import { useOsvVuln } from '@api-hooks/osv';

function VulnDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useOsvVuln(id);

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Vulnerability not found.</p>;

  return (
    <div>
      <h1>{data.id}</h1>
      <p>{data.summary}</p>
      <p>Published: {data.published}</p>
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `id` is empty) |

---

### `useOsvQuery(params, options?)`

Queries the OSV database for vulnerabilities affecting a specific package version or commit.

```tsx
import { useOsvQuery } from '@api-hooks/osv';

function PackageVulns() {
  const { data } = useOsvQuery({
    package: { name: 'lodash', ecosystem: 'npm' },
    version: '4.17.11',
  });

  return (
    <ul>
      {data?.vulns?.map(v => (
        <li key={v.id}>{v.id} — {v.summary}</li>
      ))}
    </ul>
  );
}
```

The `params` object is an `OsvQueryParams` from `osv-api-client`. You can query by:

- `version` + `package` — vulnerabilities affecting a specific package version
- `commit` — vulnerabilities introduced or fixed at a specific commit hash
- `purl` — Package URL (e.g. `'pkg:npm/lodash@4.17.11'`)

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query |

---

### `useOsvQueryBatch(queries, options?)`

Batch-queries the OSV database for multiple packages in a single request — more efficient than calling `useOsvQuery` individually for each package.

```tsx
import { useOsvQueryBatch } from '@api-hooks/osv';

function DependencyAudit() {
  const { data, isLoading } = useOsvQueryBatch([
    { package: { name: 'lodash', ecosystem: 'npm' }, version: '4.17.11' },
    { package: { name: 'axios', ecosystem: 'npm' }, version: '0.21.0' },
  ]);

  if (isLoading) return <p>Checking vulnerabilities…</p>;

  return (
    <ul>
      {data?.results.map((result, i) => (
        <li key={i}>
          {result.vulns?.length ?? 0} vulnerabilities found
        </li>
      ))}
    </ul>
  );
}
```

The query is automatically disabled when `queries` is an empty array.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `queries` is empty) |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
