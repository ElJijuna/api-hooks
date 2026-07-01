import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type {
  GitHubPagedResponse,
  GitHubRepositoryAdvisory,
  RepoAdvisoriesParams,
} from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhRepoAdvisoriesOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubRepositoryAdvisory>>;
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
  options: UseGhRepoAdvisoriesOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubRepositoryAdvisory>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubRepositoryAdvisory>, Error>({
    queryKey: ghQueryKeys.repoAdvisories(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).repoAdvisories(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
