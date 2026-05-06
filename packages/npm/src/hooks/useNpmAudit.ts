
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type NpmAuditPayload, type NpmAuditResult } from 'npmjs-api-client';
import { useNpmClient } from '../NpmClientContext.js';

/**
 * Runs a full security audit against the npm registry.
 *
 * Accepts a lock-file-shaped payload (mirrors `package-lock.json`) and returns detailed
 * advisory objects for every vulnerability found, along with recommended actions.
 *
 * Uses `useMutation` — call `mutate(payload)` or `mutateAsync(payload)` to trigger the audit.
 *
 * @returns TanStack Mutation result with {@link NpmAuditResult}
 */
export function useNpmAudit(): UseMutationResult<NpmAuditResult, Error, NpmAuditPayload> {
  const client = useNpmClient();

  return useMutation<NpmAuditResult, Error, NpmAuditPayload>({
    mutationFn: (payload) => client.audit(payload),
  });
}
