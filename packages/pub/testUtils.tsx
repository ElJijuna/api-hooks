import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type PackageResource,
  PubClient,
  type PubPackageInfo,
  type PubSearchResult,
  type PubVersionInfo,
} from 'pub-api-client';
import type { ReactNode } from 'react';

export const mockSearch = jest.fn<PubClient['search']>();
export const mockPackageInfo = jest.fn<PackageResource['info']>();
export const mockPackageVersions = jest.fn<PackageResource['versions']>();
export const mockPackageVersion = jest.fn<PackageResource['version']>();
export const mockPackageLatest = jest.fn<PackageResource['latest']>();
export const mockPackageScore = jest.fn<PackageResource['score']>();
export const mockPackage = jest.fn<(name: string) => PackageResource>();

export const packageName = 'http';
export const version = '1.2.2';

export const versionInfo: PubVersionInfo = {
  version,
  pubspec: { name: packageName, version },
  archiveUrl: `https://pub.dev/packages/${packageName}/versions/${version}.tar.gz`,
  archiveSha256: 'abc123',
  published: '2024-09-01T00:00:00Z',
};

export const packageInfo: PubPackageInfo = {
  name: packageName,
  latest: versionInfo,
  versions: [versionInfo],
};

export const searchResult: PubSearchResult = {
  packages: [{ package: packageName }],
  next: undefined,
};

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupPubMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockPackage.mockReturnValue({
    info: mockPackageInfo,
    versions: mockPackageVersions,
    version: mockPackageVersion,
    latest: mockPackageLatest,
    score: mockPackageScore,
  } as unknown as PackageResource);
  jest.spyOn(PubClient.prototype, 'search').mockImplementation(mockSearch);
  jest.spyOn(PubClient.prototype, 'package').mockImplementation(mockPackage);
}
