import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GoModuleInfo } from 'pkggo-api-client';
import { pkggoQueryKeys } from '../keys/pkggoQueryKeys.js';
import { usePkgGoClient } from '../PkgGoClientContext.js';
import type { UsePkgGoQueryOptions } from './options.js';

/**
 * Fetches the latest module info from the Go module proxy `@latest` endpoint.
 *
 * @param modulePath - Go module path (e.g. `'golang.org/x/mod'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link GoModuleInfo}
 */
export function usePkgGoModuleLatest(
  modulePath: string,
  options: UsePkgGoQueryOptions = {},
): UseQueryResult<GoModuleInfo, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePkgGoClient();

  return useQuery<GoModuleInfo, Error>({
    queryKey: pkggoQueryKeys.moduleLatest(modulePath),
    queryFn: ({ signal }) => client.module(modulePath).latest(signal),
    ...queryOptions,
    enabled: enabled && modulePath.length > 0,
  });
}
