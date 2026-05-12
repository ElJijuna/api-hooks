import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubAdvisory, type GitHubPagedResponse, type AdvisoriesParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhAdvisoriesOptions {
  /** Disable the query. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
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
  options: UseGhAdvisoriesOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubAdvisory>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubAdvisory>, Error>({
    queryKey: ghQueryKeys.advisories(params),
    queryFn: ({ signal }) => client.advisories(params, signal),
    enabled,
  });
}
