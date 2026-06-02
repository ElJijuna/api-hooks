import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmPackument } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the full packument for a package — all published versions, dist-tags, maintainers, README, and more.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmPackument}
 */
export function useNpmPackage(
  name: string,
  options: UseNpmPackageOptions = {},
): UseQueryResult<NpmPackument, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmPackument, Error>({
    queryKey: npmQueryKeys.package(name),
    queryFn: ({ signal }) => client.package(name).get(signal),
    enabled: enabled && name.length > 0,
  });
}
