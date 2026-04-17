import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BundlephobiaClient, BundlephobiaApiError, type SimilarPackages } from 'bundlephobia-api-client';
import { useBpPackageSimilar } from './useBpPackageSimilar.js';

const mockSimilar = jest.fn<(signal?: AbortSignal) => Promise<SimilarPackages>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(BundlephobiaClient.prototype, 'package')
    .mockReturnValue({
      similar: mockSimilar,
    } as unknown as ReturnType<BundlephobiaClient['package']>);
});

const mockSimilarPackages: SimilarPackages = {
  alternativePackages: [
    { name: 'preact', version: '10.19.0', description: 'Fast 3kb React alternative', size: 4500, gzip: 1800 },
    { name: 'inferno', version: '8.2.0', description: 'Inferno is a fast React-like library', size: 8200, gzip: 3100 },
  ],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useBpPackageSimilar', () => {
  it('returns data on success', async () => {
    mockSimilar.mockResolvedValue(mockSimilarPackages);

    const { result } = renderHook(() => useBpPackageSimilar('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockSimilarPackages);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockSimilar).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockSimilar.mockRejectedValue(new BundlephobiaApiError(404, 'Not Found'));

    const { result } = renderHook(() => useBpPackageSimilar('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(BundlephobiaApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useBpPackageSimilar(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSimilar).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useBpPackageSimilar('react', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSimilar).not.toHaveBeenCalled();
  });
});
