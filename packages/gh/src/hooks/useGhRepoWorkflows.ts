import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubWorkflowsResponse, WorkflowsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhRepoWorkflowsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubWorkflowsResponse>;
}

/**
 * Fetches GitHub Actions workflow definitions for a repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubWorkflowsResponse`
 */
export function useGhRepoWorkflows(
  owner: string,
  repo: string,
  params?: WorkflowsParams,
  options: UseGhRepoWorkflowsOptions = {},
): UseQueryResult<GitHubWorkflowsResponse, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubWorkflowsResponse, Error>({
    queryKey: ghQueryKeys.repoWorkflows(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).workflows(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
