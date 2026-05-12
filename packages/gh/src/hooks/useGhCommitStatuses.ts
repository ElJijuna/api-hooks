import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubCommitStatus, type GitHubPagedResponse, type CommitStatusesParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhCommitStatusesOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches the individual commit statuses (from CI/CD systems via the Statuses API).
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA, branch name, or tag name
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubCommitStatus>`
 */
export function useGhCommitStatuses(
  owner: string,
  repo: string,
  ref: string,
  params?: CommitStatusesParams,
  options: UseGhCommitStatusesOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubCommitStatus>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubCommitStatus>, Error>({
    queryKey: ghQueryKeys.commitStatuses(owner, repo, ref, params),
    queryFn: ({ signal }) => client.repo(owner, repo).commit(ref).statuses(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
