import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type MetadataChangesResponse,
  type PackageMetadataResponse,
  type PackageName,
  type PackageResource,
  type PackageResponse,
  type PackageStatsResponse,
  PackagistClient,
  type PopularPackagesResponse,
  type SearchPackagesResponse,
  type SecurityAdvisoriesResponse,
  type StatisticsResponse,
} from 'php-packagist-api-client';

export const mockListPackages = jest.fn<PackagistClient['listPackages']>();
export const mockPopular = jest.fn<PackagistClient['popular']>();
export const mockSearch = jest.fn<PackagistClient['search']>();
export const mockPackageGet = jest.fn<PackageResource['get']>();
export const mockPackageMetadata = jest.fn<PackageResource['metadata']>();
export const mockPackageStats = jest.fn<PackageResource['stats']>();
export const mockPackageSecurityAdvisories = jest.fn<PackageResource['securityAdvisories']>();
export const mockMetadataChanges = jest.fn<PackagistClient['metadataChanges']>();
export const mockStatistics = jest.fn<PackagistClient['statistics']>();
export const mockSecurityAdvisories = jest.fn<PackagistClient['securityAdvisories']>();
export const mockCreatePackage = jest.fn<PackagistClient['createPackage']>();
export const mockEditPackage = jest.fn<PackagistClient['editPackage']>();
export const mockUpdatePackage = jest.fn<PackagistClient['updatePackage']>();
export const mockPackage = jest.fn<(name: PackageName) => PackageResource>();

export const packageName = 'monolog/monolog' as PackageName;

export const summary = {
  name: packageName,
  description: 'Sends your logs to files, sockets, inboxes, databases and various web services',
  url: 'https://packagist.org/packages/monolog/monolog',
  repository: 'https://github.com/Seldaek/monolog',
  downloads: 1000,
  favers: 500,
};

export const searchResponse: SearchPackagesResponse = {
  results: [summary],
  total: 1,
  next: null,
};

export const popularResponse: PopularPackagesResponse = {
  packages: [summary],
  total: 1,
  next: null,
};

export const packageResponse: PackageResponse = {
  package: {
    name: packageName,
    description: summary.description,
    time: '2011-07-04T20:29:10+00:00',
    maintainers: [{ name: 'seldaek', avatar_url: 'https://example.com/avatar.png' }],
    versions: {
      '3.0.0': {
        name: packageName,
        version: '3.0.0',
        version_normalized: '3.0.0.0',
        type: 'library',
        require: { php: '>=8.1' },
        license: ['MIT'],
      },
    },
    type: 'library',
    repository: summary.repository,
    downloads: { total: 1000, monthly: 100, daily: 10 },
    favers: 500,
  },
};

export const metadataResponse: PackageMetadataResponse = {
  packages: {
    [packageName]: [packageResponse.package.versions['3.0.0']],
  },
  minified: 'composer/2.0',
};

export const statsResponse: PackageStatsResponse = {
  downloads: { total: 1000, monthly: 100, daily: 10 },
  versions: ['3.0.0'],
  date: '2024-01-01',
  favers: 500,
};

export const metadataChangesResponse: MetadataChangesResponse = {
  timestamp: 1_700_000_000,
  actions: [{ type: 'update', package: packageName, time: 1_700_000_000 }],
};

export const securityAdvisoriesResponse: SecurityAdvisoriesResponse = {
  advisories: {
    [packageName]: [
      {
        advisoryId: 'PKSA-123',
        packageName,
        title: 'Example advisory',
        cve: 'CVE-2024-0001',
        affectedVersions: '<3.0.0',
      },
    ],
  },
};

export const statisticsResponse: StatisticsResponse = {
  totals: { downloads: 123_456 },
};

export function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupPackagistMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockPackage.mockReturnValue({
    get: mockPackageGet,
    metadata: mockPackageMetadata,
    stats: mockPackageStats,
    securityAdvisories: mockPackageSecurityAdvisories,
  } as unknown as PackageResource);
  jest.spyOn(PackagistClient.prototype, 'listPackages').mockImplementation(mockListPackages);
  jest.spyOn(PackagistClient.prototype, 'popular').mockImplementation(mockPopular);
  jest.spyOn(PackagistClient.prototype, 'search').mockImplementation(mockSearch);
  jest.spyOn(PackagistClient.prototype, 'package').mockImplementation(mockPackage);
  jest.spyOn(PackagistClient.prototype, 'metadataChanges').mockImplementation(mockMetadataChanges);
  jest.spyOn(PackagistClient.prototype, 'statistics').mockImplementation(mockStatistics);
  jest
    .spyOn(PackagistClient.prototype, 'securityAdvisories')
    .mockImplementation(mockSecurityAdvisories);
  jest.spyOn(PackagistClient.prototype, 'createPackage').mockImplementation(mockCreatePackage);
  jest.spyOn(PackagistClient.prototype, 'editPackage').mockImplementation(mockEditPackage);
  jest.spyOn(PackagistClient.prototype, 'updatePackage').mockImplementation(mockUpdatePackage);
}
