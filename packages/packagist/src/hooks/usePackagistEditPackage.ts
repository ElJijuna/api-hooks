import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { PackageMutationResponse, PackageName } from 'php-packagist-api-client';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface PackagistEditPackageVariables {
  name: PackageName | string;
  repository: string;
}

export interface UsePackagistEditPackageOptions {
  mutationOptions?: MutationOverrides<PackageMutationResponse, PackagistEditPackageVariables>;
}

/**
 * Edits repository URL for an existing Packagist package.
 *
 * Requires a Packagist client configured with `username` and `apiToken`.
 *
 * @returns TanStack Mutation result with {@link PackageMutationResponse}
 */
export function usePackagistEditPackage(
  options: UsePackagistEditPackageOptions = {},
): UseMutationResult<PackageMutationResponse, Error, PackagistEditPackageVariables> {
  const { mutationOptions } = options;
  const client = usePackagistClient();

  return useMutation<PackageMutationResponse, Error, PackagistEditPackageVariables>({
    mutationFn: ({ name, repository }) => client.editPackage(name as PackageName, repository),
    ...mutationOptions,
  });
}
