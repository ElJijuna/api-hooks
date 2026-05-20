import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubRepository } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a GitHub repository's details.
 *
 * @param owner - Repository owner (user or org login)
 * @param repo - Repository name
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubRepository}
 */
export function useGhRepo(
  owner: string,
  repo: string,
  options: UseGhRepoOptions = {}
): UseQueryResult<GitHubRepository, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubRepository, Error>({
    queryKey: ghQueryKeys.repo(owner, repo),
    queryFn: ({ signal }) => client.repo(owner, repo).get(signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
