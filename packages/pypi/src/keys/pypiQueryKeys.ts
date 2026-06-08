import type { PyPIDownloadParams } from 'pypi-api-client';

export const pypiQueryKeys = {
  project: (name: string) => ['pypi', 'project', name] as const,
  info: (name: string) => ['pypi', 'info', name] as const,
  versions: (name: string) => ['pypi', 'versions', name] as const,
  releases: (name: string) => ['pypi', 'releases', name] as const,
  packageVulnerabilities: (name: string) => ['pypi', 'packageVulnerabilities', name] as const,
  downloads: (name: string) => ['pypi', 'downloads', name] as const,
  downloadsByPythonMajor: (name: string, params?: PyPIDownloadParams) =>
    ['pypi', 'downloadsByPythonMajor', name, params] as const,
  downloadsByPythonMinor: (name: string, params?: PyPIDownloadParams) =>
    ['pypi', 'downloadsByPythonMinor', name, params] as const,
  downloadsBySystem: (name: string, params?: PyPIDownloadParams) =>
    ['pypi', 'downloadsBySystem', name, params] as const,
  downloadsByMirrors: (name: string, params?: PyPIDownloadParams) =>
    ['pypi', 'downloadsByMirrors', name, params] as const,
  version: (name: string, version: string) => ['pypi', 'version', name, version] as const,
  latestVersion: (name: string) => ['pypi', 'latestVersion', name] as const,
  versionFiles: (name: string, version: string) => ['pypi', 'versionFiles', name, version] as const,
  versionVulnerabilities: (name: string, version: string) =>
    ['pypi', 'versionVulnerabilities', name, version] as const,
  versionDependencies: (name: string, version: string) =>
    ['pypi', 'versionDependencies', name, version] as const,
} as const;
