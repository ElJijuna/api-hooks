import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmPerson } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmPackageMaintainersOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<NpmPerson[]>;
}

/**
 * Returns the current maintainers of a package.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options
 * @returns TanStack Query result with `NpmPerson[]`
 */
export function useNpmPackageMaintainers(
  name: string,
  options: UseNpmPackageMaintainersOptions = {},
): UseQueryResult<NpmPerson[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<NpmPerson[], Error>({
    queryKey: npmQueryKeys.packageMaintainers(name),
    queryFn: ({ signal }) => client.package(name).maintainers(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
