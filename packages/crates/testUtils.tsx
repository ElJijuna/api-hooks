import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type CrateResource,
  CratesClient,
  type CratesSearchResult,
  type CrateVersion,
} from 'crates-api-client';
import type { ReactNode } from 'react';

export const mockSearch = jest.fn<CratesClient['search']>();
export const mockCrateSummary = jest.fn<CrateResource['summary']>();
export const mockCrateVersions = jest.fn<CrateResource['versions']>();
export const mockCrateVersion = jest.fn<CrateResource['version']>();
export const mockCrateLatest = jest.fn<CrateResource['latest']>();
export const mockCrate = jest.fn<(name: string) => CrateResource>();

export const crateName = 'serde';
export const version = '1.0.210';

export const crateVersion: CrateVersion = {
  id: 1,
  crate: crateName,
  num: version,
  dl_path: `/api/v1/crates/${crateName}/${version}/download`,
  readme_path: `/api/v1/crates/${crateName}/${version}/readme`,
  updated_at: '2024-09-01T00:00:00Z',
  created_at: '2024-09-01T00:00:00Z',
  downloads: 1_000_000,
  features: {},
  yanked: false,
  license: 'MIT OR Apache-2.0',
  links: {
    dependencies: `/api/v1/crates/${crateName}/${version}/dependencies`,
    version_downloads: `/api/v1/crates/${crateName}/${version}/downloads`,
    authors: `/api/v1/crates/${crateName}/${version}/authors`,
  },
  crate_size: 100_000,
  published_by: null,
  audit_actions: [],
  checksum: 'abc123',
  rust_version: null,
  has_lib: true,
  bin_names: [],
  edition: '2021',
  description: null,
  homepage: null,
  documentation: null,
  repository: null,
  trustpub_data: null,
  linecounts: null,
};

export const crateSummary = {
  id: crateName,
  name: crateName,
  updated_at: '2024-09-01T00:00:00Z',
  versions: [1],
  keywords: ['serialization'],
  categories: ['encoding'],
  badges: [],
  created_at: '2015-01-01T00:00:00Z',
  downloads: 500_000_000,
  recent_downloads: 1_000_000,
  max_version: version,
  newest_version: version,
  max_stable_version: version,
  description: 'A generic serialization/deserialization framework',
  homepage: 'https://serde.rs',
  documentation: 'https://docs.rs/serde',
  repository: 'https://github.com/serde-rs/serde',
  links: {
    version_downloads: `/api/v1/crates/${crateName}/downloads`,
    versions: `/api/v1/crates/${crateName}/versions`,
    owners: `/api/v1/crates/${crateName}/owners`,
    owner_team: `/api/v1/crates/${crateName}/owner_team`,
    owner_user: `/api/v1/crates/${crateName}/owner_user`,
    reverse_dependencies: `/api/v1/crates/${crateName}/reverse_dependencies`,
  },
  exact_match: true,
};

export const searchResult: CratesSearchResult = {
  crates: [crateSummary],
  meta: { total: 1 },
};

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupCratesMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockCrate.mockReturnValue({
    summary: mockCrateSummary,
    versions: mockCrateVersions,
    version: mockCrateVersion,
    latest: mockCrateLatest,
  } as unknown as CrateResource);
  jest.spyOn(CratesClient.prototype, 'search').mockImplementation(mockSearch);
  jest.spyOn(CratesClient.prototype, 'crate').mockImplementation(mockCrate);
}
