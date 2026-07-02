import type { MavenSearchParams, MavenSuggestParams } from 'maven-api-client';

export const mavenQueryKeys = {
  search: (params: MavenSearchParams) => ['maven', 'search', params] as const,
  searchInfinite: (params: MavenSearchParams) => ['maven', 'search', 'infinite', params] as const,
  suggest: (params: MavenSuggestParams) => ['maven', 'suggest', params] as const,
  artifactVersions: (groupId: string, artifactId: string) =>
    ['maven', 'artifact', groupId, artifactId, 'versions'] as const,
  artifactVersion: (groupId: string, artifactId: string, version: string) =>
    ['maven', 'artifact', groupId, artifactId, 'version', version] as const,
  artifactLatest: (groupId: string, artifactId: string) =>
    ['maven', 'artifact', groupId, artifactId, 'latest'] as const,
} as const;
