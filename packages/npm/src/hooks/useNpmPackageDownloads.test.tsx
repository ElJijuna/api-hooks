import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmDownloadPoint } from 'npmjs-api-client';
import { useNpmPackageDownloads } from './useNpmPackageDownloads.js';

const mockDownloads = jest.fn<() => Promise<NpmDownloadPoint>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'package')
    .mockReturnValue({
      downloads: mockDownloads,
    } as ReturnType<NpmClient['package']>);
});

const mockData: NpmDownloadPoint = {
  downloads: 12345678,
  start: '2024-03-01',
  end: '2024-03-31',
  package: 'react',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageDownloads', () => {
  it('returns data on success with default period', async () => {
    mockDownloads.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageDownloads('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockDownloads).toHaveBeenCalledWith('last-month', expect.anything());
  });

  it('passes custom period to the client', async () => {
    mockDownloads.mockResolvedValue({ ...mockData, start: '2024-03-25', end: '2024-03-31' });

    const { result } = renderHook(
      () => useNpmPackageDownloads('react', { period: 'last-week' }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockDownloads).toHaveBeenCalledWith('last-week', expect.anything());
  });

  it('returns error on failure', async () => {
    mockDownloads.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageDownloads('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageDownloads(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockDownloads).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageDownloads('react', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockDownloads).not.toHaveBeenCalled();
  });
});
