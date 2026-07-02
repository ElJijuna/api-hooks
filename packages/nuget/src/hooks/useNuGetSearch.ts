import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NuGetSearchParams, NuGetSearchResult } from 'nuget-api-client';
import { nugetQueryKeys } from '../keys/nugetQueryKeys.js';
import { useNuGetClient } from '../NuGetClientContext.js';
import type { UseNuGetQueryOptions } from './options.js';

/**
 * Searches NuGet packages using the NuGet Search Query Service.
 *
 * @param params - Search parameters (`query`, `skip`, `take`, `prerelease`, `semVerLevel`, `packageType`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NuGetSearchResult}
 */
export function useNuGetSearch(
  params: NuGetSearchParams = {},
  options: UseNuGetQueryOptions = {},
): UseQueryResult<NuGetSearchResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNuGetClient();

  return useQuery<NuGetSearchResult, Error>({
    queryKey: nugetQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    ...queryOptions,
    enabled,
  });
}
