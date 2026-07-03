import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { SwiftReleasesIndex } from 'swiftpm-api-client';
import { swiftpmQueryKeys } from '../keys/swiftpmQueryKeys.js';
import { useSwiftPMClient } from '../SwiftPMClientContext.js';
import type { UseSwiftPMQueryOptions } from './options.js';

/**
 * Lists all published releases for a Swift package.
 *
 * @param scope - Package scope (e.g. `'apple'`)
 * @param name - Package name (e.g. `'swift-argument-parser'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link SwiftReleasesIndex}
 */
export function useSwiftPMPackageReleases(
  scope: string,
  name: string,
  options: UseSwiftPMQueryOptions = {},
): UseQueryResult<SwiftReleasesIndex, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useSwiftPMClient();

  return useQuery<SwiftReleasesIndex, Error>({
    queryKey: swiftpmQueryKeys.packageReleases(scope, name),
    queryFn: ({ signal }) => client.package(scope, name).releases(signal),
    ...queryOptions,
    enabled: enabled && scope.length > 0 && name.length > 0,
  });
}
