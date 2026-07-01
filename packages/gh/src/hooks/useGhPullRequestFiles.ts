import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type {
  GitHubPagedResponse,
  GitHubPullRequestFile,
  PullRequestFilesParams,
} from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhPullRequestFilesOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubPullRequestFile>>;
}

/**
 * Fetches the files changed by a pull request.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubPullRequestFile>`
 */
export function useGhPullRequestFiles(
  owner: string,
  repo: string,
  pullNumber: number,
  params?: PullRequestFilesParams,
  options: UseGhPullRequestFilesOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubPullRequestFile>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubPullRequestFile>, Error>({
    queryKey: ghQueryKeys.pullRequestFiles(owner, repo, pullNumber, params),
    queryFn: ({ signal }) => client.repo(owner, repo).pullRequest(pullNumber).files(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
