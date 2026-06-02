import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmSearchResult } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmTopByScopeOptions {
  /** Number of packages to return (default: 20, max: 250). */
  n?: number;
  enabled?: boolean;
}

export function useNpmTopByScope(
  scope: string,
  options: UseNpmTopByScopeOptions = {},
): UseQueryResult<NpmSearchResult, Error> {
  const { n = 20, enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmSearchResult, Error>({
    queryKey: npmQueryKeys.topByScope(scope, n),
    queryFn: ({ signal }) => client.topByScope(scope, n, signal),
    enabled: enabled && scope.length > 0,
  });
}
