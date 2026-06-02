import { useMemo } from 'react';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { OsvClient, type OsvQueryParams, type OsvQueryResult } from 'osv-api-client';
import { osvQueryKeys } from '../keys/osvQueryKeys.js';

export interface UseOsvQueryOptions {
  /** Disable the query. */
  enabled?: boolean;
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
  const { enabled = true } = options;
  const client = useMemo(() => new OsvClient(), []);

  return useQuery<OsvQueryResult, Error>({
    queryKey: osvQueryKeys.query(params),
    queryFn: () => client.query(params),
    enabled,
  });
}
