import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PubVersionInfo } from 'pub-api-client';
import { pubQueryKeys } from '../keys/pubQueryKeys.js';
import { usePubClient } from '../PubClientContext.js';
import type { UsePubQueryOptions } from './options.js';

/**
 * Fetches all published versions of a pub.dev package.
 *
 * @param name - pub.dev package name (e.g. `'http'`)
 * @param options - Query options
 * @returns TanStack Query result with an array of {@link PubVersionInfo}
 */
export function usePubPackageVersions(
  name: string,
  options: UsePubQueryOptions = {},
): UseQueryResult<PubVersionInfo[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePubClient();

  return useQuery<PubVersionInfo[], Error>({
    queryKey: pubQueryKeys.packageVersions(name),
    queryFn: ({ signal }) => client.package(name).versions(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
