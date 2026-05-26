import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type TriggerWorkflowData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type TriggerWorkflowVars = { workflowId: number | string; data: TriggerWorkflowData };

/**
 * Triggers a GitHub Actions workflow dispatch event.
 *
 * Uses `useMutation` — call `mutate({ workflowId, data })` to trigger the workflow.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhTriggerWorkflow(
  owner: string,
  repo: string
): UseMutationResult<void, Error, TriggerWorkflowVars> {

  const client = useGhClient();

  return useMutation<void, Error, TriggerWorkflowVars>({
    mutationFn: ({ workflowId, data }) => client.repo(owner, repo).triggerWorkflow(workflowId, data),
  });
}
