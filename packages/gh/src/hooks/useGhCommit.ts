import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubCommit } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhCommitOptions {
  /** Disable the query. Also disabled when any required param is empty. */
  enabled?: boolean;
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
  options: UseGhCommitOptions = {},
): UseQueryResult<GitHubCommit, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubCommit, Error>({
    queryKey: ghQueryKeys.commit(owner, repo, ref),
    queryFn: ({ signal }) => client.repo(owner, repo).commit(ref).get(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && ref.length > 0,
  });
}
