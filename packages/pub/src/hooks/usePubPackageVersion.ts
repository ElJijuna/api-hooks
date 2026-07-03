import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PubVersionInfo } from 'pub-api-client';
import { pubQueryKeys } from '../keys/pubQueryKeys.js';
import { usePubClient } from '../PubClientContext.js';
import type { UsePubQueryOptions } from './options.js';

/**
 * Fetches metadata for a specific published version of a pub.dev package.
 *
 * @param name - pub.dev package name (e.g. `'http'`)
 * @param version - Version string (e.g. `'1.2.2'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PubVersionInfo}
 */
export function usePubPackageVersion(
  name: string,
  version: string,
  options: UsePubQueryOptions = {},
): UseQueryResult<PubVersionInfo, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePubClient();

  return useQuery<PubVersionInfo, Error>({
    queryKey: pubQueryKeys.packageVersion(name, version),
    queryFn: ({ signal }) => client.package(name).version(version, signal),
    ...queryOptions,
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
