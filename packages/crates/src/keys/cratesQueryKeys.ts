import type { CratesSearchParams } from 'crates-api-client';

export const cratesQueryKeys = {
  search: (params: CratesSearchParams) => ['crates', 'search', params] as const,
  searchInfinite: (params: CratesSearchParams) => ['crates', 'search', 'infinite', params] as const,
  crateSummary: (name: string) => ['crates', 'crate', name, 'summary'] as const,
  crateVersions: (name: string) => ['crates', 'crate', name, 'versions'] as const,
  crateVersion: (name: string, version: string) =>
    ['crates', 'crate', name, 'version', version] as const,
  crateLatest: (name: string) => ['crates', 'crate', name, 'latest'] as const,
} as const;
