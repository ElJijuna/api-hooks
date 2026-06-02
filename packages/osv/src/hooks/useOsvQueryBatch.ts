import { useMemo } from 'react';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type OsvBatchQuery, type OsvBatchQueryResult, OsvClient } from 'osv-api-client';
import { osvQueryKeys } from '../keys/osvQueryKeys.js';

export interface UseOsvQueryBatchOptions {
  /** Disable the query. Also disabled when `queries` is empty. */
  enabled?: boolean;
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
  const { enabled = true } = options;
  const client = useMemo(() => new OsvClient(), []);

  return useQuery<OsvBatchQueryResult, Error>({
    queryKey: osvQueryKeys.queryBatch(queries),
    queryFn: () => client.queryBatch(queries),
    enabled: enabled && queries.length > 0,
  });
}
