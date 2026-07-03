import type { SwiftSearchParams } from 'swiftpm-api-client';

export const swiftpmQueryKeys = {
  packageReleases: (scope: string, name: string) =>
    ['swiftpm', 'package', scope, name, 'releases'] as const,
  packageRelease: (scope: string, name: string, version: string) =>
    ['swiftpm', 'package', scope, name, 'release', version] as const,
  packageLatest: (scope: string, name: string) =>
    ['swiftpm', 'package', scope, name, 'latest'] as const,
  packageManifest: (scope: string, name: string, version: string) =>
    ['swiftpm', 'package', scope, name, 'manifest', version] as const,
  search: (params: SwiftSearchParams) => ['swiftpm', 'search', params] as const,
  searchInfinite: (params: SwiftSearchParams) => ['swiftpm', 'search', 'infinite', params] as const,
  lookupIdentifiers: (repositoryURL: string) =>
    ['swiftpm', 'lookupIdentifiers', repositoryURL] as const,
} as const;
