import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmVersionDownloadPoint } from 'npmjs-api-client';
import { useNpmPackageVersionDownloads } from './useNpmPackageVersionDownloads.js';

const mockDownloads = jest.fn<() => Promise<NpmVersionDownloadPoint>>();
const mockVersion = jest.fn(() => ({ downloads: mockDownloads }));

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'package')
    .mockReturnValue({
      version: mockVersion,
    } as ReturnType<NpmClient['package']>);
});

const mockData: NpmVersionDownloadPoint = {
  downloads: 123456,
  package: 'react',
  version: '18.2.0',
  period: 'last-week',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageVersionDownloads', () => {
  it('returns data on success with default period', async () => {
    mockDownloads.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageVersionDownloads('react', '18.2.0'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockVersion).toHaveBeenCalledWith('18.2.0');
    expect(mockDownloads).toHaveBeenCalledWith('last-week', expect.anything());
  });

  it('passes custom period to the client', async () => {
    mockDownloads.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useNpmPackageVersionDownloads('react', '18.2.0', { period: 'last-week' }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockDownloads).toHaveBeenCalledWith('last-week', expect.anything());
  });

  it('returns error on failure', async () => {
    mockDownloads.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(
      () => useNpmPackageVersionDownloads('react', '0.0.0-nonexistent'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionDownloads('', '18.2.0'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockVersion).not.toHaveBeenCalled();
    expect(mockDownloads).not.toHaveBeenCalled();
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionDownloads('react', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockVersion).not.toHaveBeenCalled();
    expect(mockDownloads).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageVersionDownloads('react', '18.2.0', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockVersion).not.toHaveBeenCalled();
    expect(mockDownloads).not.toHaveBeenCalled();
  });
});
