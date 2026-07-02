import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type NuGetCatalogEntry,
  NuGetClient,
  type NuGetSearchResult,
  type PackageResource,
} from 'nuget-api-client';
import type { ReactNode } from 'react';

export const mockSearch = jest.fn<NuGetClient['search']>();
export const mockAutocomplete = jest.fn<NuGetClient['autocomplete']>();
export const mockPackageVersions = jest.fn<PackageResource['versions']>();
export const mockPackageVersion = jest.fn<PackageResource['version']>();
export const mockPackageLatest = jest.fn<PackageResource['latest']>();
export const mockPackage = jest.fn<(id: string) => PackageResource>();

export const packageId = 'Newtonsoft.Json';
export const version = '13.0.3';

export const catalogEntry: NuGetCatalogEntry = {
  '@id': `https://api.nuget.org/v3/registration5-semver1/${packageId.toLowerCase()}/${version}.json`,
  id: packageId,
  version,
  description: 'Json.NET is a popular high-performance JSON framework for .NET',
  authors: 'James Newton-King',
  listed: true,
  published: '2023-03-08T00:00:00Z',
};

export const searchResult: NuGetSearchResult = {
  totalHits: 1,
  data: [
    {
      id: packageId,
      version,
      description: 'Json.NET is a popular high-performance JSON framework for .NET',
      authors: ['James Newton-King'],
      totalDownloads: 1_000_000_000,
      verified: true,
      versions: [{ version, downloads: 500_000_000, '@id': catalogEntry['@id'] }],
    },
  ],
};

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupNuGetMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockPackage.mockReturnValue({
    versions: mockPackageVersions,
    version: mockPackageVersion,
    latest: mockPackageLatest,
  } as unknown as PackageResource);
  jest.spyOn(NuGetClient.prototype, 'search').mockImplementation(mockSearch);
  jest.spyOn(NuGetClient.prototype, 'autocomplete').mockImplementation(mockAutocomplete);
  jest.spyOn(NuGetClient.prototype, 'package').mockImplementation(mockPackage);
}
