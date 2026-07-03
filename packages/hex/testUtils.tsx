import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HexClient, type HexPackage, type HexRelease, type PackageResource } from 'hex-api-client';
import type { ReactNode } from 'react';

export const mockPackages = jest.fn<HexClient['packages']>();
export const mockPackageGet = jest.fn<PackageResource['get']>();
export const mockPackageVersions = jest.fn<PackageResource['versions']>();
export const mockPackageRelease = jest.fn<PackageResource['release']>();
export const mockPackageLatestStable = jest.fn<PackageResource['latestStable']>();
export const mockPackage = jest.fn<(name: string) => PackageResource>();

export const packageName = 'phoenix';
export const version = '1.7.10';

export const hexRelease: HexRelease = {
  version,
  url: `https://hex.pm/api/packages/${packageName}/releases/${version}`,
  checksum: 'abc123',
  has_docs: true,
  inserted_at: '2024-09-01T00:00:00Z',
  updated_at: '2024-09-01T00:00:00Z',
  publisher: { username: 'chrismccord', email: 'chris@phoenixframework.org' },
  retirement: null,
  meta: {
    app: packageName,
    description: 'Peace of mind from prototype to production',
    build_tools: ['mix'],
    elixir: '~> 1.14',
    files: ['mix.exs'],
    licenses: ['MIT'],
    links: { GitHub: 'https://github.com/phoenixframework/phoenix' },
  },
};

export const hexPackage: HexPackage = {
  name: packageName,
  url: `https://hex.pm/api/packages/${packageName}`,
  html_url: `https://hex.pm/packages/${packageName}`,
  docs_html_url: `https://hexdocs.pm/${packageName}`,
  meta: {
    description: 'Peace of mind from prototype to production',
    licenses: ['MIT'],
    links: { GitHub: 'https://github.com/phoenixframework/phoenix' },
    maintainers: [{ username: 'chrismccord', email: 'chris@phoenixframework.org' }],
  },
  latest_stable_version: version,
  latest_version: version,
  inserted_at: '2014-01-01T00:00:00Z',
  updated_at: '2024-09-01T00:00:00Z',
  releases: [
    {
      version,
      url: hexRelease.url,
      has_docs: true,
      inserted_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-01T00:00:00Z',
    },
  ],
};

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupHexMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockPackage.mockReturnValue({
    get: mockPackageGet,
    versions: mockPackageVersions,
    release: mockPackageRelease,
    latestStable: mockPackageLatestStable,
  } as unknown as PackageResource);
  jest.spyOn(HexClient.prototype, 'packages').mockImplementation(mockPackages);
  jest.spyOn(HexClient.prototype, 'package').mockImplementation(mockPackage);
}
