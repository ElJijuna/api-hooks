import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NuGetCatalogEntry } from 'nuget-api-client';
import { nugetQueryKeys } from '../keys/nugetQueryKeys.js';
import { useNuGetClient } from '../NuGetClientContext.js';
import type { UseNuGetQueryOptions } from './options.js';

/**
 * Fetches the catalog entry (metadata) for a specific published version of a NuGet package.
 *
 * @param id - NuGet package ID (e.g. `'Newtonsoft.Json'`); case-insensitive
 * @param version - Exact version string (e.g. `'13.0.3'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NuGetCatalogEntry}
 */
export function useNuGetPackageVersion(
  id: string,
  version: string,
  options: UseNuGetQueryOptions = {},
): UseQueryResult<NuGetCatalogEntry, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNuGetClient();

  return useQuery<NuGetCatalogEntry, Error>({
    queryKey: nugetQueryKeys.packageVersion(id, version),
    queryFn: ({ signal }) => client.package(id).version(version, signal),
    ...queryOptions,
    enabled: enabled && id.length > 0 && version.length > 0,
  });
}
