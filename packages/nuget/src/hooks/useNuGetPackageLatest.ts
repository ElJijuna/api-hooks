import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NuGetCatalogEntry } from 'nuget-api-client';
import { nugetQueryKeys } from '../keys/nugetQueryKeys.js';
import { useNuGetClient } from '../NuGetClientContext.js';
import type { UseNuGetQueryOptions } from './options.js';

/**
 * Fetches the catalog entry for the latest listed (stable) version of a NuGet package.
 *
 * @param id - NuGet package ID (e.g. `'Newtonsoft.Json'`); case-insensitive
 * @param options - Query options
 * @returns TanStack Query result with {@link NuGetCatalogEntry}
 */
export function useNuGetPackageLatest(
  id: string,
  options: UseNuGetQueryOptions = {},
): UseQueryResult<NuGetCatalogEntry, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNuGetClient();

  return useQuery<NuGetCatalogEntry, Error>({
    queryKey: nugetQueryKeys.packageLatest(id),
    queryFn: ({ signal }) => client.package(id).latest(signal),
    ...queryOptions,
    enabled: enabled && id.length > 0,
  });
}
