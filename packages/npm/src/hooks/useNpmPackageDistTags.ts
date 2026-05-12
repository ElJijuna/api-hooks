
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmDistTags } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageDistTagsOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Returns the dist-tags map for a package (e.g. `{ latest: '18.2.0', next: '19.0.0-rc.1' }`).
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmDistTags}
 */
export function useNpmPackageDistTags(
  name: string,
  options: UseNpmPackageDistTagsOptions = {}
): UseQueryResult<NpmDistTags, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmDistTags, Error>({
    queryKey: npmQueryKeys.packageDistTags(name),
    queryFn: ({ signal }) => client.package(name).distTags(signal),
    enabled: enabled && name.length > 0,
  });
}
