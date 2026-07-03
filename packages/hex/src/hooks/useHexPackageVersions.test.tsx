import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { HexApiError } from 'hex-api-client';
import {
  mockPackage,
  mockPackageVersions,
  packageName,
  setupHexMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { useHexPackageVersions } from './useHexPackageVersions.js';

beforeEach(setupHexMocks);

describe('useHexPackageVersions', () => {
  it('returns the version list', async () => {
    mockPackageVersions.mockResolvedValue([version, '1.7.9']);

    const { result } = renderHook(() => useHexPackageVersions(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([version, '1.7.9']);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
  });

  it('returns API errors', async () => {
    mockPackageVersions.mockRejectedValue(new HexApiError(404, 'Not Found'));

    const { result } = renderHook(() => useHexPackageVersions(packageName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(HexApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useHexPackageVersions(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useHexPackageVersions(packageName, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageVersions.mockResolvedValue([version]);
    const { result } = renderHook(
      () => useHexPackageVersions(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
