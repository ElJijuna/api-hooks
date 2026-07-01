import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmSearchResult } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmTopByPopularityOptions {
  /** Number of packages to return (default: 20, max: 250). */
  n?: number;
  enabled?: boolean;
  queryOptions?: QueryOverrides<NpmSearchResult>;
}

export function useNpmTopByPopularity(
  options: UseNpmTopByPopularityOptions = {},
): UseQueryResult<NpmSearchResult, Error> {
  const { n = 20, enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<NpmSearchResult, Error>({
    queryKey: npmQueryKeys.topByPopularity(n),
    queryFn: ({ signal }) => client.topByPopularity(n, signal),
    ...queryOptions,
    enabled,
  });
}
