import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { MetadataChangesOptions, MetadataChangesResponse } from 'php-packagist-api-client';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { UsePackagistQueryOptions } from './options.js';

/**
 * Polls Packagist metadata changes.
 *
 * @param params - Timestamp filter
 * @param options - Query options
 * @returns TanStack Query result with {@link MetadataChangesResponse}
 */
export function usePackagistMetadataChanges(
  params?: MetadataChangesOptions,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<MetadataChangesResponse, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePackagistClient();

  return useQuery<MetadataChangesResponse, Error>({
    queryKey: packagistQueryKeys.metadataChanges(params),
    queryFn: ({ signal }) => client.metadataChanges(params, signal),
    ...queryOptions,
    enabled,
  });
}
