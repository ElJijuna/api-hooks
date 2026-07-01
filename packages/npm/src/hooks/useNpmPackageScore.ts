import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmsScore } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmPackageScoreOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<NpmsScore>;
}

/**
 * Fetches the quality, maintenance, and popularity score for a package from npms.io.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmsScore}
 */
export function useNpmPackageScore(
  name: string,
  options: UseNpmPackageScoreOptions = {},
): UseQueryResult<NpmsScore, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<NpmsScore, Error>({
    queryKey: npmQueryKeys.packageScore(name),
    queryFn: ({ signal }) => client.package(name).score(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
