import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { nugetQueryKeys } from '../keys/nugetQueryKeys.js';
import { useNuGetClient } from '../NuGetClientContext.js';
import type { UseNuGetQueryOptions } from './options.js';

/**
 * Fetches all published versions of a NuGet package, ordered oldest → newest.
 *
 * @param id - NuGet package ID (e.g. `'Newtonsoft.Json'`); case-insensitive
 * @param options - Query options
 * @returns TanStack Query result with an array of version strings
 */
export function useNuGetPackageVersions(
  id: string,
  options: UseNuGetQueryOptions = {},
): UseQueryResult<string[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNuGetClient();

  return useQuery<string[], Error>({
    queryKey: nugetQueryKeys.packageVersions(id),
    queryFn: ({ signal }) => client.package(id).versions(signal),
    ...queryOptions,
    enabled: enabled && id.length > 0,
  });
}
