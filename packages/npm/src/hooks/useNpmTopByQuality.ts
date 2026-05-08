import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmSearchResult } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmTopByQualityOptions {
  /** Number of packages to return (default: 20, max: 250). */
  n?: number;
  enabled?: boolean;
}

export function useNpmTopByQuality(
  options: UseNpmTopByQualityOptions = {}
): UseQueryResult<NpmSearchResult, Error> {
  const { n = 20, enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmSearchResult, Error>({
    queryKey: npmQueryKeys.topByQuality(n),
    queryFn: ({ signal }) => client.topByQuality(n, signal),
    enabled,
  });
}
