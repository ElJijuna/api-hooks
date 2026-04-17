# @api-hooks/bp

React hooks for the [Bundlephobia API](https://bundlephobia.com), built on [`bundlephobia-api-client`](https://www.npmjs.com/package/bundlephobia-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

[![npm](https://img.shields.io/npm/v/@api-hooks/bp)](https://www.npmjs.com/package/@api-hooks/bp)
[![npm downloads](https://img.shields.io/npm/dm/@api-hooks/bp)](https://www.npmjs.com/package/@api-hooks/bp)
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
npm install @api-hooks/bp bundlephobia-api-client @tanstack/react-query
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

| Hook | Description | Returns |
| ---- | ----------- | ------- |
| [`useBpPackageSize(name)`](#usebppackagesizename) | Bundle size for the latest version | `BundleSize` |
| [`useBpPackageVersionSize(name, version)`](#usebppackageversionsizename-version) | Bundle size for a specific version | `BundleSize` |
| [`useBpPackageHistory(name)`](#usebppackagehistoryname) | Size history across all versions | `PackageHistory` |
| [`useBpPackageSimilar(name)`](#usebppackagesimilarname) | Similar / alternative packages | `SimilarPackages` |

---

## API Reference

### `useBpPackageSize(name)`

Fetches the bundle size for the latest published version of a package.

```tsx
import { useBpPackageSize } from '@api-hooks/bp';

function BundleInfo({ name }: { name: string }) {
  const { data, isLoading, isError } = useBpPackageSize(name);

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Package not found.</p>;

  return (
    <div>
      <p>Minified: {data.size} B</p>
      <p>Gzip: {data.gzip} B</p>
    </div>
  );
}
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disable the query (also disabled when `name` is empty) |

---

### `useBpPackageVersionSize(name, version)`

Fetches the bundle size for a specific version of a package.

```tsx
const { data } = useBpPackageVersionSize('react', '18.2.0');

console.log(data?.gzip); // 2670
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` or `version` is empty |

---

### `useBpPackageHistory(name)`

Fetches the bundle size history for a package across all published versions — ideal for rendering size-over-time charts.

```tsx
const { data: history } = useBpPackageHistory('react');

Object.entries(history ?? {}).forEach(([version, entry]) => {
  console.log(`${version} — ${entry.gzip}B gzip`);
});
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` is empty |

---

### `useBpPackageSimilar(name)`

Fetches similar / alternative packages with their bundle sizes.

```tsx
const { data } = useBpPackageSimilar('react');

data?.alternativePackages.forEach(p => {
  console.log(`${p.name}@${p.version} — ${p.gzip}B gzip`);
});
```

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `enabled` | `boolean` | `true` | Disabled when `name` is empty |

---

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
