import { jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type GoModuleInfo,
  type ModuleResource,
  PkgGoClient,
  type VersionResource,
} from 'pkggo-api-client';
import type { ReactNode } from 'react';

export const mockModuleLatest = jest.fn<ModuleResource['latest']>();
export const mockModuleVersions = jest.fn<ModuleResource['versions']>();
export const mockVersionInfo = jest.fn<VersionResource['info']>();
export const mockVersionMod = jest.fn<VersionResource['mod']>();
export const mockVersionZip = jest.fn<VersionResource['zip']>();
export const mockVersion = jest.fn<(version: string) => VersionResource>();
export const mockModule = jest.fn<(modulePath: string) => ModuleResource>();

export const modulePath = 'golang.org/x/mod';
export const version = 'v0.37.0';

export const moduleInfo: GoModuleInfo = {
  Version: version,
  Time: '2024-09-01T00:00:00Z',
};

export function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function setupPkgGoMocks() {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  mockVersion.mockReturnValue({
    info: mockVersionInfo,
    mod: mockVersionMod,
    zip: mockVersionZip,
  } as unknown as VersionResource);
  mockModule.mockReturnValue({
    latest: mockModuleLatest,
    versions: mockModuleVersions,
    version: mockVersion,
  } as unknown as ModuleResource);
  jest.spyOn(PkgGoClient.prototype, 'module').mockImplementation(mockModule);
}
