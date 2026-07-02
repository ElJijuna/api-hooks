import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type ArtifactResource,
  MavenClient,
  type MavenSearchResult,
  type MavenVersionDoc,
} from 'maven-api-client';
import type { ReactNode } from 'react';

export const mockSearch = jest.fn<MavenClient['search']>();
export const mockSuggest = jest.fn<MavenClient['suggest']>();
export const mockArtifactVersions = jest.fn<ArtifactResource['versions']>();
export const mockArtifactVersion = jest.fn<ArtifactResource['version']>();
export const mockArtifactLatest = jest.fn<ArtifactResource['latest']>();
export const mockArtifact = jest.fn<(groupId: string, artifactId: string) => ArtifactResource>();

export const groupId = 'org.springframework';
export const artifactId = 'spring-core';
export const version = '6.1.0';

export const versionDoc: MavenVersionDoc = {
  id: `${groupId}:${artifactId}:${version}`,
  g: groupId,
  a: artifactId,
  v: version,
  p: 'jar',
  timestamp: 1_700_000_000_000,
  ec: ['.jar', '-sources.jar', '.pom'],
};

export const searchResult: MavenSearchResult = {
  responseHeader: { status: 0, QTime: 5 },
  response: {
    numFound: 1,
    start: 0,
    docs: [
      {
        id: `${groupId}:${artifactId}`,
        g: groupId,
        a: artifactId,
        latestVersion: version,
        repositoryId: 'central',
        p: 'jar',
        timestamp: 1_700_000_000_000,
        versionCount: 42,
        ec: ['.jar', '-sources.jar', '.pom'],
      },
    ],
  },
};

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupMavenMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockArtifact.mockReturnValue({
    versions: mockArtifactVersions,
    version: mockArtifactVersion,
    latest: mockArtifactLatest,
  } as unknown as ArtifactResource);
  jest.spyOn(MavenClient.prototype, 'search').mockImplementation(mockSearch);
  jest.spyOn(MavenClient.prototype, 'suggest').mockImplementation(mockSuggest);
  jest.spyOn(MavenClient.prototype, 'artifact').mockImplementation(mockArtifact);
}
