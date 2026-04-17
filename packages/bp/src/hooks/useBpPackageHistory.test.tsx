import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BundlephobiaClient, BundlephobiaApiError, type PackageHistory } from 'bundlephobia-api-client';
import { useBpPackageHistory } from './useBpPackageHistory.js';

const mockHistory = jest.fn<(signal?: AbortSignal) => Promise<PackageHistory>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(BundlephobiaClient.prototype, 'package')
    .mockReturnValue({
      history: mockHistory,
    } as unknown as ReturnType<BundlephobiaClient['package']>);
});

const mockPackageHistory: PackageHistory = {
  '17.0.2': { size: 6450, gzip: 2665 },
  '18.0.0': { size: 6455, gzip: 2668 },
  '18.2.0': { size: 6457, gzip: 2670 },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useBpPackageHistory', () => {
  it('returns data on success', async () => {
    mockHistory.mockResolvedValue(mockPackageHistory);

    const { result } = renderHook(() => useBpPackageHistory('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockPackageHistory);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockHistory).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockHistory.mockRejectedValue(new BundlephobiaApiError(404, 'Not Found'));

    const { result } = renderHook(() => useBpPackageHistory('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(BundlephobiaApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useBpPackageHistory(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockHistory).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useBpPackageHistory('react', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockHistory).not.toHaveBeenCalled();
  });
});
