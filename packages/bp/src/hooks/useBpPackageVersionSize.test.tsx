import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BundlephobiaClient, BundlephobiaApiError, type BundleSize } from 'bundlephobia-api-client';
import { useBpPackageVersionSize } from './useBpPackageVersionSize.js';

const mockSize = jest.fn<(version?: string, signal?: AbortSignal) => Promise<BundleSize>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(BundlephobiaClient.prototype, 'package')
    .mockReturnValue({
      size: mockSize,
    } as unknown as ReturnType<BundlephobiaClient['package']>);
});

const mockBundleSize: BundleSize = {
  name: 'react',
  version: '18.2.0',
  description: 'React is a JavaScript library for building user interfaces.',
  size: 6457,
  gzip: 2670,
  dependencyCount: 2,
  hasSideEffects: false,
  hasJSModule: false,
  hasJSNext: false,
  isModuleType: false,
  scoped: false,
  assets: [{ name: 'main', size: 6457, gzip: 2670, type: 'js' }],
  dependencySizes: [
    { name: 'react', approximateSize: 5000 },
    { name: 'loose-envify', approximateSize: 1457 },
  ],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useBpPackageVersionSize', () => {
  it('returns data on success', async () => {
    mockSize.mockResolvedValue(mockBundleSize);

    const { result } = renderHook(() => useBpPackageVersionSize('react', '18.2.0'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockBundleSize);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockSize).toHaveBeenCalledWith('18.2.0', expect.anything());
  });

  it('returns error on failure', async () => {
    mockSize.mockRejectedValue(new BundlephobiaApiError(404, 'Not Found'));

    const { result } = renderHook(
      () => useBpPackageVersionSize('nonexistent-pkg-xyz', '1.0.0'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(BundlephobiaApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useBpPackageVersionSize('', '18.2.0'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSize).not.toHaveBeenCalled();
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useBpPackageVersionSize('react', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSize).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useBpPackageVersionSize('react', '18.2.0', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSize).not.toHaveBeenCalled();
  });
});
