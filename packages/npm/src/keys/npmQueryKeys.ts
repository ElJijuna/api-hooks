export const npmQueryKeys = {
  package: (name: string) => ['npm', 'package', name] as const,
  packageVersion: (name: string, version: string) =>
    ['npm', 'package', name, 'version', version] as const,
  packageVersions: (name: string) =>
    ['npm', 'package', name, 'versions'] as const,
  packageDistTags: (name: string) =>
    ['npm', 'package', name, 'dist-tags'] as const,
  packageMaintainers: (name: string) =>
    ['npm', 'package', name, 'maintainers'] as const,
  packageDownloads: (name: string, period: string) =>
    ['npm', 'package', name, 'downloads', period] as const,
  packageVersionDownloads: (name: string, version: string, period: string) =>
    ['npm', 'package', name, 'version', version, 'downloads', period] as const,
  packageDownloadRange: (name: string, period: string) =>
    ['npm', 'package', name, 'download-range', period] as const,
  packageScore: (name: string) =>
    ['npm', 'package', name, 'score'] as const,
  packageSize: (name: string) =>
    ['npm', 'package', name, 'size'] as const,
  packageCdnStats: (name: string, groupBy: string, period: string) =>
    ['npm', 'package', name, 'cdn-stats', groupBy, period] as const,
  packageVersionSize: (name: string, version: string) =>
    ['npm', 'package', name, 'version', version, 'size'] as const,
  packageVersionFiles: (name: string, version: string) =>
    ['npm', 'package', name, 'version', version, 'files'] as const,
  packageVersionCdnStats: (name: string, version: string, groupBy: string, period: string) =>
    ['npm', 'package', name, 'version', version, 'cdn-stats', groupBy, period] as const,
  packageVersionDependencies: (name: string, version: string) =>
    ['npm', 'package', name, 'version', version, 'dependencies'] as const,
  bulkDownloads: (packages: string[], period: string) =>
    ['npm', 'bulk-downloads', packages, period] as const,
  maintainer: (username: string) =>
    ['npm', 'maintainer', username] as const,
  maintainerPackages: (username: string, params?: object) =>
    ['npm', 'maintainer', username, 'packages', params] as const,
  search: (params: object) =>
    ['npm', 'search', params] as const,
} as const;
