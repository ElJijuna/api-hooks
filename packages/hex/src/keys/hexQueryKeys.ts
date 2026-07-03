import type { HexPackageSearchParams } from 'hex-api-client';

export const hexQueryKeys = {
  package: (name: string) => ['hex', 'package', name] as const,
  packageVersions: (name: string) => ['hex', 'package', name, 'versions'] as const,
  packageRelease: (name: string, version: string) =>
    ['hex', 'package', name, 'release', version] as const,
  packageLatestStable: (name: string) => ['hex', 'package', name, 'latestStable'] as const,
  packages: (params: HexPackageSearchParams) => ['hex', 'packages', params] as const,
  packagesInfinite: (params: HexPackageSearchParams) =>
    ['hex', 'packages', 'infinite', params] as const,
} as const;
