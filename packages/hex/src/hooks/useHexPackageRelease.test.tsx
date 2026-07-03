import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { HexApiError } from 'hex-api-client';
import {
  hexRelease,
  mockPackage,
  mockPackageRelease,
  packageName,
  setupHexMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { useHexPackageRelease } from './useHexPackageRelease.js';

beforeEach(setupHexMocks);

describe('useHexPackageRelease', () => {
  it('returns release metadata', async () => {
    mockPackageRelease.mockResolvedValue(hexRelease);

    const { result } = renderHook(() => useHexPackageRelease(packageName, version), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(hexRelease);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
    expect(mockPackageRelease).toHaveBeenCalledWith(version, expect.anything());
  });

  it('returns API errors', async () => {
    mockPackageRelease.mockRejectedValue(new HexApiError(404, 'Not Found'));

    const { result } = renderHook(() => useHexPackageRelease(packageName, version), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(HexApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useHexPackageRelease(packageName, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useHexPackageRelease(packageName, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageRelease.mockResolvedValue(hexRelease);
    const { result } = renderHook(
      () => useHexPackageRelease(packageName, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
