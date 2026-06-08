import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { StatisticsResponse } from 'php-packagist-api-client';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { UsePackagistQueryOptions } from './options.js';

/**
 * Fetches global Packagist statistics.
 *
 * @param options - Query options
 * @returns TanStack Query result with {@link StatisticsResponse}
 */
export function usePackagistStatistics(
  options: UsePackagistQueryOptions = {},
): UseQueryResult<StatisticsResponse, Error> {
  const { enabled = true } = options;
  const client = usePackagistClient();

  return useQuery<StatisticsResponse, Error>({
    queryKey: packagistQueryKeys.statistics(),
    queryFn: ({ signal }) => client.statistics(signal),
    enabled,
  });
}
