import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { MavenVersionDoc } from 'maven-api-client';
import { mavenQueryKeys } from '../keys/mavenQueryKeys.js';
import { useMavenClient } from '../MavenClientContext.js';
import type { UseMavenQueryOptions } from './options.js';

/**
 * Fetches metadata for the latest published version of a Maven Central artifact.
 *
 * @param groupId - Maven group ID (e.g. `'org.springframework'`)
 * @param artifactId - Maven artifact ID (e.g. `'spring-core'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link MavenVersionDoc}
 */
export function useMavenArtifactLatest(
  groupId: string,
  artifactId: string,
  options: UseMavenQueryOptions = {},
): UseQueryResult<MavenVersionDoc, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMavenClient();

  return useQuery<MavenVersionDoc, Error>({
    queryKey: mavenQueryKeys.artifactLatest(groupId, artifactId),
    queryFn: ({ signal }) => client.artifact(groupId, artifactId).latest(signal),
    ...queryOptions,
    enabled: enabled && groupId.length > 0 && artifactId.length > 0,
  });
}
