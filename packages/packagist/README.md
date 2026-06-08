# @api-hooks/packagist

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the Packagist API, built on [`php-packagist-api-client`](https://www.npmjs.com/package/php-packagist-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

## Installation

```bash
npm install @api-hooks/packagist php-packagist-api-client @tanstack/react-query
```

## Setup

Wrap your app with `QueryClientProvider`. Add `PackagistClientProvider` when you need client options such as auth credentials or a custom user agent.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PackagistClientProvider } from '@api-hooks/packagist';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PackagistClientProvider options={{ userAgent: 'my-app (mailto:me@example.com)' }}>
        <YourApp />
      </PackagistClientProvider>
    </QueryClientProvider>
  );
}
```

Authenticated package mutations require `username` and `apiToken`:

```tsx
<PackagistClientProvider options={{ username: 'user', apiToken: process.env.PACKAGIST_TOKEN }}>
  <YourApp />
</PackagistClientProvider>
```

## Hooks

| Hook | Description |
| ---- | ----------- |
| `usePackagistListPackages(params?, options?)` | List package names, optionally filtered by vendor/type |
| `usePackagistPopular(params?, options?)` | Popular packages |
| `usePackagistSearch(params, options?)` | Search packages by query, tags, or type |
| `usePackagistPackage(name, options?)` | Full package metadata |
| `usePackagistPackageMetadata(name, params?, options?)` | Composer v2 metadata |
| `usePackagistPackageStats(name, options?)` | Package download stats |
| `usePackagistPackageSecurityAdvisories(name, options?)` | Advisories for one package |
| `usePackagistMetadataChanges(params?, options?)` | Metadata change polling |
| `usePackagistStatistics(options?)` | Global Packagist statistics |
| `usePackagistSecurityAdvisories(params, options?)` | Advisories by packages or update timestamp |
| `usePackagistCreatePackage()` | Create package mutation |
| `usePackagistEditPackage()` | Edit package repository mutation |
| `usePackagistUpdatePackage()` | Trigger package update mutation |

All query hooks return TanStack Query `UseQueryResult` and accept `{ enabled?: boolean }`.
Mutation hooks return `UseMutationResult`.

```tsx
import { usePackagistSearch } from '@api-hooks/packagist';

function PackageSearch() {
  const { data, isLoading } = usePackagistSearch({ query: 'monolog', perPage: 5 });

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {data?.results.map(pkg => (
        <li key={pkg.name}>{pkg.name}</li>
      ))}
    </ul>
  );
}
```

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
