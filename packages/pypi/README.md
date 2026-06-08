# @api-hooks/pypi

<p align="center">
  <img src="https://raw.githubusercontent.com/ElJijuna/api-hooks/main/public/assets/api-hooks.png" alt="api-hooks logo" width="240" />
</p>

React hooks for the PyPI API, built on [`pypi-api-client`](https://www.npmjs.com/package/pypi-api-client) and [`@tanstack/react-query`](https://tanstack.com/query).

## Installation

```bash
npm install @api-hooks/pypi pypi-api-client @tanstack/react-query
```

## Hooks

| Hook | Description |
| ---- | ----------- |
| `usePyPIProject(name)` | Full project metadata |
| `usePyPIProjectInfo(name)` | Latest version `info` metadata |
| `usePyPIPackageVersions(name)` | Published version strings |
| `usePyPIReleases(name)` | Releases map |
| `usePyPIPackageVulnerabilities(name)` | Latest package vulnerabilities |
| `usePyPIDownloads(name)` | Recent day/week/month downloads |
| `usePyPIDownloadsByPythonMajor(name, { params })` | Downloads by Python major |
| `usePyPIDownloadsByPythonMinor(name, { params })` | Downloads by Python minor |
| `usePyPIDownloadsBySystem(name, { params })` | Downloads by OS |
| `usePyPIDownloadsByMirrors(name, { params })` | Downloads by mirror traffic |
| `usePyPIVersion(name, version)` | Specific version metadata |
| `usePyPILatestVersion(name)` | Latest version metadata |
| `usePyPIVersionFiles(name, version)` | Files for a version |
| `usePyPIVersionVulnerabilities(name, version)` | Vulnerabilities for a version |
| `usePyPIVersionDependencies(name, version)` | Resolved deps.dev dependency graph |

All hooks return TanStack Query `UseQueryResult` and accept `{ enabled?: boolean }`.

```tsx
import { usePyPIProjectInfo } from '@api-hooks/pypi';

function PackageInfo() {
  const { data, isLoading } = usePyPIProjectInfo('requests');

  if (isLoading) return <p>Loading...</p>;

  return <p>{data?.summary}</p>;
}
```

## License

MIT © [ElJijuna](https://github.com/ElJijuna)
