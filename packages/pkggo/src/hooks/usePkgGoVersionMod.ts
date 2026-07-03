import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { pkggoQueryKeys } from '../keys/pkggoQueryKeys.js';
import { usePkgGoClient } from '../PkgGoClientContext.js';
import type { UsePkgGoQueryOptions } from './options.js';

/**
 * Fetches the raw `go.mod` file contents for a module version.
 *
 * @param modulePath - Go module path (e.g. `'golang.org/x/mod'`)
 * @param version - Module version (e.g. `'v0.37.0'`)
 * @param options - Query options
 * @returns TanStack Query result with the raw `go.mod` file contents
 */
export function usePkgGoVersionMod(
  modulePath: string,
  version: string,
  options: UsePkgGoQueryOptions = {},
): UseQueryResult<string, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePkgGoClient();

  return useQuery<string, Error>({
    queryKey: pkggoQueryKeys.versionMod(modulePath, version),
    queryFn: ({ signal }) => client.module(modulePath).version(version).mod(signal),
    ...queryOptions,
    enabled: enabled && modulePath.length > 0 && version.length > 0,
  });
}
