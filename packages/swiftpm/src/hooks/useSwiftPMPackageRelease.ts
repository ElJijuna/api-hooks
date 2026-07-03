import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { SwiftRelease } from 'swiftpm-api-client';
import { swiftpmQueryKeys } from '../keys/swiftpmQueryKeys.js';
import { useSwiftPMClient } from '../SwiftPMClientContext.js';
import type { UseSwiftPMQueryOptions } from './options.js';

/**
 * Fetches metadata for a specific Swift package release version.
 *
 * @param scope - Package scope (e.g. `'apple'`)
 * @param name - Package name (e.g. `'swift-argument-parser'`)
 * @param version - Semver version string (e.g. `'1.1.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link SwiftRelease}
 */
export function useSwiftPMPackageRelease(
  scope: string,
  name: string,
  version: string,
  options: UseSwiftPMQueryOptions = {},
): UseQueryResult<SwiftRelease, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useSwiftPMClient();

  return useQuery<SwiftRelease, Error>({
    queryKey: swiftpmQueryKeys.packageRelease(scope, name, version),
    queryFn: ({ signal }) => client.package(scope, name).release(version, signal),
    ...queryOptions,
    enabled: enabled && scope.length > 0 && name.length > 0 && version.length > 0,
  });
}
