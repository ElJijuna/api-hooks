import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PubPackageInfo } from 'pub-api-client';
import { pubQueryKeys } from '../keys/pubQueryKeys.js';
import { usePubClient } from '../PubClientContext.js';
import type { UsePubQueryOptions } from './options.js';

/**
 * Fetches full pub.dev package info, including latest version and all published versions.
 *
 * @param name - pub.dev package name (e.g. `'http'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PubPackageInfo}
 */
export function usePubPackageInfo(
  name: string,
  options: UsePubQueryOptions = {},
): UseQueryResult<PubPackageInfo, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePubClient();

  return useQuery<PubPackageInfo, Error>({
    queryKey: pubQueryKeys.packageInfo(name),
    queryFn: ({ signal }) => client.package(name).info(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
