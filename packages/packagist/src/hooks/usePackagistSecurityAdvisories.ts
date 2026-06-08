import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type {
  SecurityAdvisoriesOptions,
  SecurityAdvisoriesResponse,
} from 'php-packagist-api-client';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { UsePackagistQueryOptions } from './options.js';

function hasAdvisoryFilter(params: SecurityAdvisoriesOptions) {
  return Boolean(params.updatedSince || params.packages?.length);
}

/**
 * Fetches Packagist security advisories by packages or update timestamp.
 *
 * @param params - Advisory filters
 * @param options - Query options
 * @returns TanStack Query result with {@link SecurityAdvisoriesResponse}
 */
export function usePackagistSecurityAdvisories(
  params: SecurityAdvisoriesOptions,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<SecurityAdvisoriesResponse, Error> {
  const { enabled = true } = options;
  const client = usePackagistClient();

  return useQuery<SecurityAdvisoriesResponse, Error>({
    queryKey: packagistQueryKeys.securityAdvisories(params),
    queryFn: ({ signal }) => client.securityAdvisories(params, signal),
    enabled: enabled && hasAdvisoryFilter(params),
  });
}
