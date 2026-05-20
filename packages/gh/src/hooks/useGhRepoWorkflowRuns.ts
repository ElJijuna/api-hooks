import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubWorkflowRunsResponse, type WorkflowRunsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoWorkflowRunsOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
}

/**
 * Fetches workflow runs for a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubWorkflowRunsResponse`
 */
export function useGhRepoWorkflowRuns(
  owner: string,
  repo: string,
  params?: WorkflowRunsParams,
  options: UseGhRepoWorkflowRunsOptions = {}
): UseQueryResult<GitHubWorkflowRunsResponse, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubWorkflowRunsResponse, Error>({
    queryKey: ghQueryKeys.repoWorkflowRuns(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).workflowRuns(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
