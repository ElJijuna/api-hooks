import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { OsvQueryParams, OsvQueryResult } from 'osv-api-client';
import { useOsvClient } from '../OsvClientContext.js';
import { osvQueryKeys } from '../keys/osvQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseOsvQueryOptions {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<OsvQueryResult>;
}

/**
 * Queries the OSV database for vulnerabilities affecting a specific package version or commit.
 *
 * Query by `version` + `package`, by `commit` hash, or by `purl` (Package URL).
 *
 * @param params - OSV query parameters (`OsvQueryParams` from `osv-api-client`)
 * @param options - Query options
 * @returns TanStack Query result with {@link OsvQueryResult}
 */
export function useOsvQuery(
  params: OsvQueryParams,
  options: UseOsvQueryOptions = {},
): UseQueryResult<OsvQueryResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useOsvClient();

  return useQuery<OsvQueryResult, Error>({
    queryKey: osvQueryKeys.query(params),
    queryFn: () => client.query(params),
    ...queryOptions,
    enabled,
  });
}
