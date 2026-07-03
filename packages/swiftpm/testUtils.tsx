import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  type PackageResource,
  SwiftPMClient,
  type SwiftRelease,
  type SwiftReleasesIndex,
  type SwiftSearchResult,
} from 'swiftpm-api-client';

export const mockSearch = jest.fn<SwiftPMClient['search']>();
export const mockLookupIdentifiers = jest.fn<SwiftPMClient['lookupIdentifiers']>();
export const mockPackageReleases = jest.fn<PackageResource['releases']>();
export const mockPackageRelease = jest.fn<PackageResource['release']>();
export const mockPackageLatest = jest.fn<PackageResource['latest']>();
export const mockPackageManifest = jest.fn<PackageResource['manifest']>();
export const mockPackage = jest.fn<(scope: string, name: string) => PackageResource>();

export const scope = 'apple';
export const name = 'swift-argument-parser';
export const version = '1.1.0';

export const release: SwiftRelease = {
  id: `${scope}.${name}`,
  version,
  resources: [{ name: 'source-archive', type: 'application/zip', checksum: 'sha256:abc123' }],
  metadata: {
    author: { name: 'Apple' },
    description: 'Parse command-line arguments ergonomically',
    repositoryURLs: [`https://github.com/${scope}/${name}`],
  },
};

export const releasesIndex: SwiftReleasesIndex = {
  releases: { [version]: { url: `https://registry.swift.example/${scope}/${name}/${version}` } },
};

export const searchResult: SwiftSearchResult = {
  hasMoreResults: true,
  results: [
    {
      packageId: `${scope}.${name}`,
      packageName: name,
      repositoryName: name,
      repositoryOwner: scope,
      stars: 3200,
      lastActivityAt: '2024-09-01T00:00:00Z',
      hasDocs: true,
    },
  ],
};

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupSwiftPMMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockPackage.mockReturnValue({
    releases: mockPackageReleases,
    release: mockPackageRelease,
    latest: mockPackageLatest,
    manifest: mockPackageManifest,
  } as unknown as PackageResource);
  jest.spyOn(SwiftPMClient.prototype, 'search').mockImplementation(mockSearch);
  jest
    .spyOn(SwiftPMClient.prototype, 'lookupIdentifiers')
    .mockImplementation(mockLookupIdentifiers);
  jest.spyOn(SwiftPMClient.prototype, 'package').mockImplementation(mockPackage);
}
