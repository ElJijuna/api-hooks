import type { NuGetAutocompleteParams, NuGetSearchParams } from 'nuget-api-client';

export const nugetQueryKeys = {
  search: (params: NuGetSearchParams) => ['nuget', 'search', params] as const,
  searchInfinite: (params: NuGetSearchParams) => ['nuget', 'search', 'infinite', params] as const,
  autocomplete: (params: NuGetAutocompleteParams) => ['nuget', 'autocomplete', params] as const,
  packageVersions: (id: string) => ['nuget', 'package', id, 'versions'] as const,
  packageVersion: (id: string, version: string) =>
    ['nuget', 'package', id, 'version', version] as const,
  packageLatest: (id: string) => ['nuget', 'package', id, 'latest'] as const,
} as const;
