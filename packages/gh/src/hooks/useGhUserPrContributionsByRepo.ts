import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { RepoContribution } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserPrContributionsByRepoOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a user's pull request contributions broken down by repository (GraphQL).
 *
 * @param login - GitHub username
 * @param options - Query options
 * @returns TanStack Query result with `RepoContribution[]`
 */
export function useGhUserPrContributionsByRepo(
  login: string,
  options: UseGhUserPrContributionsByRepoOptions = {},
): UseQueryResult<RepoContribution[], Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<RepoContribution[], Error>({
    queryKey: ghQueryKeys.userPrContributionsByRepo(login),
    queryFn: ({ signal }) => client.user(login).pullRequestContributionsByRepo(signal),
    enabled: enabled && login.length > 0,
  });
}
