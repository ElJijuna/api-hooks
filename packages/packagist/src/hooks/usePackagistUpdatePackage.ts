import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { PackageUpdateResponse } from 'php-packagist-api-client';
import { usePackagistClient } from '../PackagistClientContext.js';

/**
 * Triggers Packagist update for a repository or package URL.
 *
 * Requires a Packagist client configured with `username` and `apiToken`.
 *
 * @returns TanStack Mutation result with {@link PackageUpdateResponse}
 */
export function usePackagistUpdatePackage(): UseMutationResult<PackageUpdateResponse, Error, string> {
  const client = usePackagistClient();

  return useMutation<PackageUpdateResponse, Error, string>({
    mutationFn: (repository) => client.updatePackage(repository),
  });
}
