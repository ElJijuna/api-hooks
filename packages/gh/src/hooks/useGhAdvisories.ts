import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { AdvisoriesParams, GitHubAdvisory, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhAdvisoriesOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Lists global security advisories from the GitHub Advisory Database.
 *
 * @param params - Optional filters: `ghsa_id`, `cve_id`, `ecosystem`, `severity`, `cwe_id`, `is_withdrawn`, `sort`, `direction`, `per_page`, `page`
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubAdvisory>`
 */
export function useGhAdvisories(
  params?: AdvisoriesParams,
  options: UseGhAdvisoriesOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubAdvisory>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubAdvisory>, Error>({
    queryKey: ghQueryKeys.advisories(params),
    queryFn: ({ signal }) => client.advisories(params, signal),
    enabled,
  });
}
