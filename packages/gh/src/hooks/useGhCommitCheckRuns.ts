import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubCheckRun, type GitHubPagedResponse, type CheckRunsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhCommitCheckRunsOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches GitHub Actions check runs for a commit.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA, branch name, or tag name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubCheckRun>`
 */
export function useGhCommitCheckRuns(
  owner: string,
  repo: string,
  ref: string,
  params?: CheckRunsParams,
  options: UseGhCommitCheckRunsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubCheckRun>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubCheckRun>, Error>({
    queryKey: ghQueryKeys.commitCheckRuns(owner, repo, ref, params),
    queryFn: ({ signal }) => client.repo(owner, repo).commit(ref).checkRuns(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
