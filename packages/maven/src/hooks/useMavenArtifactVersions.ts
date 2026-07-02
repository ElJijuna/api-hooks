import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { mavenQueryKeys } from '../keys/mavenQueryKeys.js';
import { useMavenClient } from '../MavenClientContext.js';
import type { UseMavenQueryOptions } from './options.js';

/**
 * Fetches all published versions of a Maven Central artifact.
 *
 * @param groupId - Maven group ID (e.g. `'org.springframework'`)
 * @param artifactId - Maven artifact ID (e.g. `'spring-core'`)
 * @param options - Query options
 * @returns TanStack Query result with an array of version strings
 */
export function useMavenArtifactVersions(
  groupId: string,
  artifactId: string,
  options: UseMavenQueryOptions = {},
): UseQueryResult<string[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMavenClient();

  return useQuery<string[], Error>({
    queryKey: mavenQueryKeys.artifactVersions(groupId, artifactId),
    queryFn: ({ signal }) => client.artifact(groupId, artifactId).versions(signal),
    ...queryOptions,
    enabled: enabled && groupId.length > 0 && artifactId.length > 0,
  });
}
