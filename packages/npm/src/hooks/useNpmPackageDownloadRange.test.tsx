import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmDownloadRange } from 'npmjs-api-client';
import { useNpmPackageDownloadRange } from './useNpmPackageDownloadRange.js';

const mockDownloadRange = jest.fn<() => Promise<NpmDownloadRange>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'package')
    .mockReturnValue({
      downloadRange: mockDownloadRange,
    } as ReturnType<NpmClient['package']>);
});

const mockData: NpmDownloadRange = {
  downloads: [
    { day: '2024-03-01', downloads: 400000 },
    { day: '2024-03-02', downloads: 420000 },
  ],
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

describe('useNpmPackageDownloadRange', () => {
  it('returns data on success with default period', async () => {
    mockDownloadRange.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageDownloadRange('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockDownloadRange).toHaveBeenCalledWith('last-month', expect.anything());
  });

  it('passes custom period to the client', async () => {
    mockDownloadRange.mockResolvedValue({ ...mockData, start: '2024-01-01', end: '2024-01-31' });

    const { result } = renderHook(
      () => useNpmPackageDownloadRange('react', { period: '2024-01-01:2024-01-31' }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockDownloadRange).toHaveBeenCalledWith('2024-01-01:2024-01-31', expect.anything());
  });

  it('returns error on failure', async () => {
    mockDownloadRange.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageDownloadRange('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageDownloadRange(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockDownloadRange).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageDownloadRange('react', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockDownloadRange).not.toHaveBeenCalled();
  });
});
