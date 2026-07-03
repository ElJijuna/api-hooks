import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GoModuleInfo } from 'pkggo-api-client';
import { pkggoQueryKeys } from '../keys/pkggoQueryKeys.js';
import { usePkgGoClient } from '../PkgGoClientContext.js';
import type { UsePkgGoQueryOptions } from './options.js';

/**
 * Fetches metadata for a specific module version.
 *
 * @param modulePath - Go module path (e.g. `'golang.org/x/mod'`)
 * @param version - Module version (e.g. `'v0.37.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link GoModuleInfo}
 */
export function usePkgGoVersionInfo(
  modulePath: string,
  version: string,
  options: UsePkgGoQueryOptions = {},
): UseQueryResult<GoModuleInfo, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePkgGoClient();

  return useQuery<GoModuleInfo, Error>({
    queryKey: pkggoQueryKeys.versionInfo(modulePath, version),
    queryFn: ({ signal }) => client.module(modulePath).version(version).info(signal),
    ...queryOptions,
    enabled: enabled && modulePath.length > 0 && version.length > 0,
  });
}
