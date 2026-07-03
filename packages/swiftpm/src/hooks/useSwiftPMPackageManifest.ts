import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { swiftpmQueryKeys } from '../keys/swiftpmQueryKeys.js';
import { useSwiftPMClient } from '../SwiftPMClientContext.js';
import type { UseSwiftPMQueryOptions } from './options.js';

/**
 * Fetches the raw `Package.swift` manifest for a specific release version.
 *
 * @param scope - Package scope (e.g. `'apple'`)
 * @param name - Package name (e.g. `'swift-argument-parser'`)
 * @param version - Semver version string (e.g. `'1.1.0'`)
 * @param options - Query options
 * @returns TanStack Query result with the raw manifest content as a string
 */
export function useSwiftPMPackageManifest(
  scope: string,
  name: string,
  version: string,
  options: UseSwiftPMQueryOptions = {},
): UseQueryResult<string, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useSwiftPMClient();

  return useQuery<string, Error>({
    queryKey: swiftpmQueryKeys.packageManifest(scope, name, version),
    queryFn: ({ signal }) => client.package(scope, name).manifest(version, signal),
    ...queryOptions,
    enabled: enabled && scope.length > 0 && name.length > 0 && version.length > 0,
  });
}
