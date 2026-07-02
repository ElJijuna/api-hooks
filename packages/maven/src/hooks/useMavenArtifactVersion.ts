import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { MavenVersionDoc } from 'maven-api-client';
import { mavenQueryKeys } from '../keys/mavenQueryKeys.js';
import { useMavenClient } from '../MavenClientContext.js';
import type { UseMavenQueryOptions } from './options.js';

/**
 * Fetches metadata for a specific published version of a Maven Central artifact.
 *
 * @param groupId - Maven group ID (e.g. `'org.springframework'`)
 * @param artifactId - Maven artifact ID (e.g. `'spring-core'`)
 * @param version - Version string (e.g. `'6.1.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link MavenVersionDoc}
 */
export function useMavenArtifactVersion(
  groupId: string,
  artifactId: string,
  version: string,
  options: UseMavenQueryOptions = {},
): UseQueryResult<MavenVersionDoc, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMavenClient();

  return useQuery<MavenVersionDoc, Error>({
    queryKey: mavenQueryKeys.artifactVersion(groupId, artifactId, version),
    queryFn: ({ signal }) => client.artifact(groupId, artifactId).version(version, signal),
    ...queryOptions,
    enabled: enabled && groupId.length > 0 && artifactId.length > 0 && version.length > 0,
  });
}
