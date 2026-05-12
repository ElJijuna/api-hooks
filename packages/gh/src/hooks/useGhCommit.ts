import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubCommit } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhCommitOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches a single commit from a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA, branch name, or tag name
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubCommit}
 */
export function useGhCommit(
  owner: string,
  repo: string,
  ref: string,
  options: UseGhCommitOptions = {}
): UseQueryResult<GitHubCommit, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubCommit, Error>({
    queryKey: ghQueryKeys.commit(owner, repo, ref),
    queryFn: ({ signal }) => client.repo(owner, repo).commit(ref).get(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
