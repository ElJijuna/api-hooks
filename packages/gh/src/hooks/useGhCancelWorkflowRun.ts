import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Cancels a GitHub Actions workflow run.
 *
 * Uses `useMutation` — call `mutate(runId)` to cancel the run.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhCancelWorkflowRun(
  owner: string,
  repo: string
): UseMutationResult<void, Error, number> {

  const client = useGhClient();

  return useMutation<void, Error, number>({
    mutationFn: (runId) => client.repo(owner, repo).cancelWorkflowRun(runId),
  });
}
