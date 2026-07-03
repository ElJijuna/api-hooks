import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { HexApiError } from 'hex-api-client';
import { hexPackage, mockPackages, setupHexMocks, wrapper } from '../../testUtils.js';
import { useHexPackages } from './useHexPackages.js';

beforeEach(setupHexMocks);

describe('useHexPackages', () => {
  it('returns package list', async () => {
    mockPackages.mockResolvedValue([hexPackage]);

    const { result } = renderHook(() => useHexPackages({ search: 'phoenix' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([hexPackage]);
    expect(mockPackages).toHaveBeenCalledWith({ search: 'phoenix' }, expect.anything());
  });

  it('returns API errors', async () => {
    mockPackages.mockRejectedValue(new HexApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useHexPackages({ search: 'phoenix' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(HexApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useHexPackages({ search: 'phoenix' }, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackages.mockResolvedValue([hexPackage]);
    const { result } = renderHook(
      () => useHexPackages({ search: 'phoenix' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
