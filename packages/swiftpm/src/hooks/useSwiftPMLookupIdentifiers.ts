import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { SwiftIdentifiersResult } from 'swiftpm-api-client';
import { swiftpmQueryKeys } from '../keys/swiftpmQueryKeys.js';
import { useSwiftPMClient } from '../SwiftPMClientContext.js';
import type { UseSwiftPMQueryOptions } from './options.js';

/**
 * Looks up package identifiers by source repository URL.
 *
 * @param repositoryURL - Source repository URL (e.g. a GitHub URL)
 * @param options - Query options
 * @returns TanStack Query result with {@link SwiftIdentifiersResult}
 */
export function useSwiftPMLookupIdentifiers(
  repositoryURL: string,
  options: UseSwiftPMQueryOptions = {},
): UseQueryResult<SwiftIdentifiersResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useSwiftPMClient();

  return useQuery<SwiftIdentifiersResult, Error>({
    queryKey: swiftpmQueryKeys.lookupIdentifiers(repositoryURL),
    queryFn: ({ signal }) => client.lookupIdentifiers(repositoryURL, signal),
    ...queryOptions,
    enabled: enabled && repositoryURL.length > 0,
  });
}
