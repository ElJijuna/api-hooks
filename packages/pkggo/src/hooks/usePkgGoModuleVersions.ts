import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { pkggoQueryKeys } from '../keys/pkggoQueryKeys.js';
import { usePkgGoClient } from '../PkgGoClientContext.js';
import type { UsePkgGoQueryOptions } from './options.js';

/**
 * Lists module versions known by the configured Go module proxy.
 *
 * @param modulePath - Go module path (e.g. `'golang.org/x/mod'`)
 * @param options - Query options
 * @returns TanStack Query result with an array of version strings
 */
export function usePkgGoModuleVersions(
  modulePath: string,
  options: UsePkgGoQueryOptions = {},
): UseQueryResult<string[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePkgGoClient();

  return useQuery<string[], Error>({
    queryKey: pkggoQueryKeys.moduleVersions(modulePath),
    queryFn: ({ signal }) => client.module(modulePath).versions(signal),
    ...queryOptions,
    enabled: enabled && modulePath.length > 0,
  });
}
