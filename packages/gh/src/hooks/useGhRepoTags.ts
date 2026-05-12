import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubTag, type GitHubPagedResponse, type TagsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoTagsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches tags for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubTag>`
 */
export function useGhRepoTags(
  owner: string,
  repo: string,
  params?: TagsParams,
  options: UseGhRepoTagsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubTag>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubTag>, Error>({
    queryKey: ghQueryKeys.repoTags(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).tags(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
