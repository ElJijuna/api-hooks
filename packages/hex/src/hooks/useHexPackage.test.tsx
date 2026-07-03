import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { HexApiError } from 'hex-api-client';
import {
  hexPackage,
  mockPackage,
  mockPackageGet,
  packageName,
  setupHexMocks,
  wrapper,
} from '../../testUtils.js';
import { useHexPackage } from './useHexPackage.js';

beforeEach(setupHexMocks);

describe('useHexPackage', () => {
  it('returns package metadata', async () => {
    mockPackageGet.mockResolvedValue(hexPackage);

    const { result } = renderHook(() => useHexPackage(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(hexPackage);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
  });

  it('returns API errors', async () => {
    mockPackageGet.mockRejectedValue(new HexApiError(404, 'Not Found'));

    const { result } = renderHook(() => useHexPackage(packageName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(HexApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useHexPackage(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useHexPackage(packageName, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageGet.mockResolvedValue(hexPackage);
    const { result } = renderHook(
      () => useHexPackage(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
