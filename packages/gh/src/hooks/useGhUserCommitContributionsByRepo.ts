import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type RepoContribution } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserCommitContributionsByRepoOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a user's commit contributions broken down by repository (GraphQL).
 *
 * @param login - GitHub username
 * @param options - Query options
 * @returns TanStack Query result with `RepoContribution[]`
 */
export function useGhUserCommitContributionsByRepo(
  login: string,
  options: UseGhUserCommitContributionsByRepoOptions = {}
): UseQueryResult<RepoContribution[], Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<RepoContribution[], Error>({
    queryKey: ghQueryKeys.userCommitContributionsByRepo(login),
    queryFn: ({ signal }) => client.user(login).commitContributionsByRepo(signal),
    enabled: enabled && login.length > 0,
  });
}
