import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { HexApiError, type HexPackage } from 'hex-api-client';
import { hexPackage, mockPackages, setupHexMocks, wrapper } from '../../testUtils.js';
import { useHexPackagesInfinite } from './useHexPackagesInfinite.js';

beforeEach(setupHexMocks);

function makePage(size: number): HexPackage[] {
  return Array.from({ length: size }, (_, i) => ({ ...hexPackage, name: `package-${i}` }));
}

describe('useHexPackagesInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockPackages.mockResolvedValue(makePage(10));

    const { result } = renderHook(() => useHexPackagesInfinite({ search: 'phoenix' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockPackages).toHaveBeenCalledWith({ search: 'phoenix', page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockPackages.mockResolvedValueOnce(makePage(10)).mockResolvedValueOnce(makePage(3));

    const { result } = renderHook(() => useHexPackagesInfinite({ search: 'phoenix' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockPackages).toHaveBeenNthCalledWith(
      2,
      { search: 'phoenix', page: 2 },
      expect.anything(),
    );
  });

  it('reports hasNextPage=false when the page is not full', async () => {
    mockPackages.mockResolvedValue(makePage(3));

    const { result } = renderHook(() => useHexPackagesInfinite({ search: 'phoenix' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when the page is full', async () => {
    mockPackages.mockResolvedValue(makePage(10));

    const { result } = renderHook(() => useHexPackagesInfinite({ search: 'phoenix' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('passes per_page option to the client and uses it for the full-page check', async () => {
    mockPackages.mockResolvedValue(makePage(5));

    const { result } = renderHook(
      () => useHexPackagesInfinite({ search: 'phoenix', per_page: 5 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockPackages).toHaveBeenCalledWith(
      { search: 'phoenix', per_page: 5, page: 1 },
      expect.anything(),
    );
    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockPackages.mockRejectedValue(new HexApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useHexPackagesInfinite({ search: 'phoenix' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(HexApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useHexPackagesInfinite({ search: 'phoenix', enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackages.mockResolvedValue(makePage(10));
    const { result } = renderHook(
      () => useHexPackagesInfinite({ search: 'phoenix', queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
