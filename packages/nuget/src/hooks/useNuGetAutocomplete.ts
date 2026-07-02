import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NuGetAutocompleteParams, NuGetAutocompleteResult } from 'nuget-api-client';
import { nugetQueryKeys } from '../keys/nugetQueryKeys.js';
import { useNuGetClient } from '../NuGetClientContext.js';
import type { UseNuGetQueryOptions } from './options.js';

/**
 * Autocompletes NuGet package IDs using the NuGet Search Autocomplete Service.
 *
 * @param params - Autocomplete parameters (`q`, `skip`, `take`, `prerelease`, `semVerLevel`, `packageType`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NuGetAutocompleteResult}
 */
export function useNuGetAutocomplete(
  params: NuGetAutocompleteParams = {},
  options: UseNuGetQueryOptions = {},
): UseQueryResult<NuGetAutocompleteResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNuGetClient();

  return useQuery<NuGetAutocompleteResult, Error>({
    queryKey: nugetQueryKeys.autocomplete(params),
    queryFn: ({ signal }) => client.autocomplete(params, signal),
    ...queryOptions,
    enabled,
  });
}
