import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubPagedResponse, type GitHubRepositoryAdvisory, type RepoAdvisoriesParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoAdvisoriesOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Fetches security advisories for a GitHub repository.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param params - Optional filter and pagination params
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with a paged list of {@link GitHubRepositoryAdvisory}
 */
export function useGhRepoAdvisories(
  owner: string,
  repo: string,
  params?: RepoAdvisoriesParams,
  options: UseGhRepoAdvisoriesOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubRepositoryAdvisory>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubRepositoryAdvisory>, Error>({
    queryKey: ghQueryKeys.repoAdvisories(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).repoAdvisories(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
