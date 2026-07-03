import type { PubSearchParams } from 'pub-api-client';

export const pubQueryKeys = {
  packageInfo: (name: string) => ['pub', 'package', name, 'info'] as const,
  packageVersions: (name: string) => ['pub', 'package', name, 'versions'] as const,
  packageVersion: (name: string, version: string) =>
    ['pub', 'package', name, 'version', version] as const,
  packageLatest: (name: string) => ['pub', 'package', name, 'latest'] as const,
  packageScore: (name: string) => ['pub', 'package', name, 'score'] as const,
  search: (params: PubSearchParams) => ['pub', 'search', params] as const,
  searchInfinite: (params: PubSearchParams) => ['pub', 'search', 'infinite', params] as const,
} as const;
