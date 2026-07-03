import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PubPackageScore } from 'pub-api-client';
import { pubQueryKeys } from '../keys/pubQueryKeys.js';
import { usePubClient } from '../PubClientContext.js';
import type { UsePubQueryOptions } from './options.js';

/**
 * Fetches pub.dev pub points, likes, and popularity score for a package.
 *
 * @param name - pub.dev package name (e.g. `'http'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PubPackageScore}
 */
export function usePubPackageScore(
  name: string,
  options: UsePubQueryOptions = {},
): UseQueryResult<PubPackageScore, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePubClient();

  return useQuery<PubPackageScore, Error>({
    queryKey: pubQueryKeys.packageScore(name),
    queryFn: ({ signal }) => client.package(name).score(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
