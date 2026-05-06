
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type UnpkgFile } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageVersionFilesOptions {
  /** Disable the query. Also disabled when `name` or `version` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the complete file tree of a published version from unpkg.
 *
 * Returns every file and directory in the tarball with individual sizes and paths —
 * useful for auditing package contents.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param version - Version string (e.g. `'18.2.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link UnpkgFile}
 */
export function useNpmPackageVersionFiles(
  name: string,
  version: string,
  options: UseNpmPackageVersionFilesOptions = {}
): UseQueryResult<UnpkgFile, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<UnpkgFile, Error>({
    queryKey: npmQueryKeys.packageVersionFiles(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).files(signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
