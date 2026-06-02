import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubIssue } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhIssueOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
}

/**
 * Fetches a single issue from a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param issueNumber - Issue number
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubIssue}
 */
export function useGhIssue(
  owner: string,
  repo: string,
  issueNumber: number,
  options: UseGhIssueOptions = {},
): UseQueryResult<GitHubIssue, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubIssue, Error>({
    queryKey: ghQueryKeys.issue(owner, repo, issueNumber),
    queryFn: ({ signal }) => client.repo(owner, repo).issue(issueNumber).get(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && issueNumber > 0,
  });
}
