import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type PyPIBreakdownDownloads,
  PyPIClient,
  type PyPIDepsDevDependencies,
  type PyPIDownloadParams,
  type PyPIFile,
  type PyPIProject,
  type PyPIProjectInfo,
  type PyPIRecentDownloads,
  type PyPIVersionInfo,
  type PyPIVulnerability,
} from 'pypi-api-client';
import type { ReactNode } from 'react';

export const mockProjectGet = jest.fn<(signal?: AbortSignal) => Promise<PyPIProject>>();
export const mockInfo = jest.fn<(signal?: AbortSignal) => Promise<PyPIProjectInfo>>();
export const mockVersions = jest.fn<(signal?: AbortSignal) => Promise<string[]>>();
export const mockReleases =
  jest.fn<(signal?: AbortSignal) => Promise<Record<string, PyPIFile[]>>>();
export const mockPackageVulnerabilities =
  jest.fn<(signal?: AbortSignal) => Promise<PyPIVulnerability[]>>();
export const mockDownloads = jest.fn<(signal?: AbortSignal) => Promise<PyPIRecentDownloads>>();
export const mockDownloadsByPythonMajor =
  jest.fn<(params?: PyPIDownloadParams, signal?: AbortSignal) => Promise<PyPIBreakdownDownloads>>();
export const mockDownloadsByPythonMinor =
  jest.fn<(params?: PyPIDownloadParams, signal?: AbortSignal) => Promise<PyPIBreakdownDownloads>>();
export const mockDownloadsBySystem =
  jest.fn<(params?: PyPIDownloadParams, signal?: AbortSignal) => Promise<PyPIBreakdownDownloads>>();
export const mockDownloadsByMirrors =
  jest.fn<(params?: PyPIDownloadParams, signal?: AbortSignal) => Promise<PyPIBreakdownDownloads>>();
export const mockVersionGet = jest.fn<(signal?: AbortSignal) => Promise<PyPIVersionInfo>>();
export const mockVersionFiles = jest.fn<(signal?: AbortSignal) => Promise<PyPIFile[]>>();
export const mockVersionVulnerabilities =
  jest.fn<(signal?: AbortSignal) => Promise<PyPIVulnerability[]>>();
export const mockVersionDependencies =
  jest.fn<(signal?: AbortSignal) => Promise<PyPIDepsDevDependencies>>();
export const mockLatestGet = jest.fn<(signal?: AbortSignal) => Promise<PyPIVersionInfo>>();
export const mockVersion = jest.fn();
export const mockLatest = jest.fn();
export const mockPackage = jest.fn<(name: string) => ReturnType<PyPIClient['package']>>();

export const info: PyPIProjectInfo = {
  name: 'requests',
  version: '2.31.0',
  summary: 'Python HTTP for Humans.',
  description: null,
  description_content_type: null,
  author: null,
  author_email: null,
  maintainer: null,
  maintainer_email: null,
  license: 'Apache-2.0',
  license_expression: null,
  keywords: null,
  classifiers: ['Programming Language :: Python :: 3'],
  requires_dist: ['urllib3<3,>=1.21.1'],
  requires_python: '>=3.7',
  home_page: null,
  project_url: null,
  project_urls: { Source: 'https://github.com/psf/requests' },
  bugtrack_url: null,
  docs_url: null,
  download_url: null,
  yanked: false,
  yanked_reason: null,
};

export const file: PyPIFile = {
  filename: 'requests-2.31.0-py3-none-any.whl',
  url: 'https://files.pythonhosted.org/requests.whl',
  size: 58_000,
  digests: { md5: 'md5', sha256: 'sha256' },
  packagetype: 'bdist_wheel',
  python_version: 'py3',
  requires_python: '>=3.7',
  upload_time_iso_8601: '2023-05-22T15:00:00Z',
  yanked: false,
  yanked_reason: null,
};

export const vulnerability: PyPIVulnerability = {
  id: 'GHSA-j8r2-6x86-q33q',
  source: 'osv',
  link: 'https://osv.dev',
  aliases: ['CVE-2023-32681'],
  details: 'details',
  summary: 'summary',
  fixed_in: ['2.31.0'],
  withdrawn: null,
};

export const project: PyPIProject = {
  info,
  last_serial: 123,
  releases: { '2.31.0': [file] },
  urls: [file],
  vulnerabilities: [vulnerability],
};

export const versionInfo: PyPIVersionInfo = {
  info,
  last_serial: 123,
  urls: [file],
  vulnerabilities: [vulnerability],
};

export const recentDownloads: PyPIRecentDownloads = {
  data: { last_day: 10, last_week: 70, last_month: 300 },
  package: 'requests',
  type: 'recent_downloads',
};

export const breakdown: PyPIBreakdownDownloads = {
  data: [{ category: '3.11', date: '2024-01-01', downloads: 42 }],
  package: 'requests',
  type: 'python_minor_downloads',
};

export const dependencies: PyPIDepsDevDependencies = {
  nodes: [
    {
      versionKey: { system: 'PYPI', name: 'requests', version: '2.31.0' },
      relation: 'SELF',
      bundled: false,
      errors: [],
    },
  ],
  edges: [],
};

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupPyPIMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockVersion.mockReturnValue({
    get: mockVersionGet,
    files: mockVersionFiles,
    vulnerabilities: mockVersionVulnerabilities,
    dependencies: mockVersionDependencies,
  });
  mockLatest.mockReturnValue({ get: mockLatestGet });
  mockPackage.mockReturnValue({
    get: mockProjectGet,
    info: mockInfo,
    versions: mockVersions,
    releases: mockReleases,
    vulnerabilities: mockPackageVulnerabilities,
    downloads: mockDownloads,
    downloadsByPythonMajor: mockDownloadsByPythonMajor,
    downloadsByPythonMinor: mockDownloadsByPythonMinor,
    downloadsBySystem: mockDownloadsBySystem,
    downloadsByMirrors: mockDownloadsByMirrors,
    version: mockVersion,
    latest: mockLatest,
  } as unknown as ReturnType<PyPIClient['package']>);
  jest.spyOn(PyPIClient.prototype, 'package').mockImplementation(mockPackage);
}
