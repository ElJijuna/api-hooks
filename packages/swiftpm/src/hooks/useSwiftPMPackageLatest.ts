import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { SwiftRelease } from 'swiftpm-api-client';
import { swiftpmQueryKeys } from '../keys/swiftpmQueryKeys.js';
import { useSwiftPMClient } from '../SwiftPMClientContext.js';
import type { UseSwiftPMQueryOptions } from './options.js';

/**
 * Fetches metadata for the latest (highest semver) release of a Swift package.
 *
 * @param scope - Package scope (e.g. `'apple'`)
 * @param name - Package name (e.g. `'swift-argument-parser'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link SwiftRelease}
 */
export function useSwiftPMPackageLatest(
  scope: string,
  name: string,
  options: UseSwiftPMQueryOptions = {},
): UseQueryResult<SwiftRelease, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useSwiftPMClient();

  return useQuery<SwiftRelease, Error>({
    queryKey: swiftpmQueryKeys.packageLatest(scope, name),
    queryFn: ({ signal }) => client.package(scope, name).latest(signal),
    ...queryOptions,
    enabled: enabled && scope.length > 0 && name.length > 0,
  });
}
