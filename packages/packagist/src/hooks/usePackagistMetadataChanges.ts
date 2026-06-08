import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import {
  type MetadataChangesOptions,
  type MetadataChangesResponse,
} from 'php-packagist-api-client';
import { usePackagistClient } from '../PackagistClientContext.js';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
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
  const { enabled = true } = options;
  const client = usePackagistClient();

  return useQuery<MetadataChangesResponse, Error>({
    queryKey: packagistQueryKeys.metadataChanges(params),
    queryFn: ({ signal }) => client.metadataChanges(params, signal),
    enabled,
  });
}
