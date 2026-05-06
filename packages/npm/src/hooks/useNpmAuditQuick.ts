
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type NpmAuditPayload, type NpmAuditQuickResult } from 'npmjs-api-client';
import { useNpmClient } from '../NpmClientContext.js';

/**
 * Runs a quick security audit against the npm registry.
 *
 * Same payload as {@link useNpmAudit} but returns only vulnerability counts by severity —
 * no advisory details or recommended actions. Faster and lighter than the full audit.
 *
 * Uses `useMutation` — call `mutate(payload)` or `mutateAsync(payload)` to trigger the audit.
 *
 * @returns TanStack Mutation result with {@link NpmAuditQuickResult}
 */
export function useNpmAuditQuick(): UseMutationResult<NpmAuditQuickResult, Error, NpmAuditPayload> {
  const client = useNpmClient();

  return useMutation<NpmAuditQuickResult, Error, NpmAuditPayload>({
    mutationFn: (payload) => client.auditQuick(payload),
  });
}
