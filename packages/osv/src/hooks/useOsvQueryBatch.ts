import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { OsvBatchQuery, OsvBatchQueryResult } from 'osv-api-client';
import { useOsvClient } from '../OsvClientContext.js';
import { osvQueryKeys } from '../keys/osvQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseOsvQueryBatchOptions {
  /** Disable the query. Also disabled when `queries` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<OsvBatchQueryResult>;
}

/**
 * Batch-queries the OSV database for multiple packages in a single request.
 *
 * More efficient than calling `useOsvQuery` individually for each package.
 *
 * @param queries - Array of `OsvBatchQuery` objects from `osv-api-client`
 * @param options - Query options
 * @returns TanStack Query result with {@link OsvBatchQueryResult}
 */
export function useOsvQueryBatch(
  queries: OsvBatchQuery[],
  options: UseOsvQueryBatchOptions = {},
): UseQueryResult<OsvBatchQueryResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useOsvClient();

  return useQuery<OsvBatchQueryResult, Error>({
    queryKey: osvQueryKeys.queryBatch(queries),
    queryFn: () => client.queryBatch(queries),
    ...queryOptions,
    enabled: enabled && queries.length > 0,
  });
}
