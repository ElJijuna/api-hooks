import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { PackageMutationResponse } from 'php-packagist-api-client';
import { usePackagistClient } from '../PackagistClientContext.js';

/**
 * Creates a Packagist package from a repository URL.
 *
 * Requires a Packagist client configured with `username` and `apiToken`.
 *
 * @returns TanStack Mutation result with {@link PackageMutationResponse}
 */
export function usePackagistCreatePackage(): UseMutationResult<
  PackageMutationResponse,
  Error,
  string
> {
  const client = usePackagistClient();

  return useMutation<PackageMutationResponse, Error, string>({
    mutationFn: (repository) => client.createPackage(repository),
  });
}
