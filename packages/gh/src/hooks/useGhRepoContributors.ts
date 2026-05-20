import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubPagedResponse, type PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface GitHubContributor {
  login?: string;
  id?: number;
  contributions: number;
  avatar_url?: string;
  html_url?: string;
}

export interface UseGhRepoContributorsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
}

/**
 * Fetches contributors for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional pagination params and `anon` flag for anonymous contributors
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubContributor>`
 */
export function useGhRepoContributors(
  owner: string,
  repo: string,
  params?: PaginationParams & { anon?: boolean },
  options: UseGhRepoContributorsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubContributor>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubContributor>, Error>({
    queryKey: ghQueryKeys.repoContributors(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).contributors(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
