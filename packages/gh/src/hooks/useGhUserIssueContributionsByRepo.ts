import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { RepoContribution } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhUserIssueContributionsByRepoOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<RepoContribution[]>;
}

/**
 * Fetches a user's issue contributions broken down by repository (GraphQL).
 *
 * @param login - GitHub username
 * @param options - Query options
 * @returns TanStack Query result with `RepoContribution[]`
 */
export function useGhUserIssueContributionsByRepo(
  login: string,
  options: UseGhUserIssueContributionsByRepoOptions = {},
): UseQueryResult<RepoContribution[], Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<RepoContribution[], Error>({
    queryKey: ghQueryKeys.userIssueContributionsByRepo(login),
    queryFn: ({ signal }) => client.user(login).issueContributionsByRepo(signal),
    ...queryOptions,
    enabled: enabled && login.length > 0,
  });
}
