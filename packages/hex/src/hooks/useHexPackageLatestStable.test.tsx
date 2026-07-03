import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { HexApiError } from 'hex-api-client';
import {
  mockPackage,
  mockPackageLatestStable,
  packageName,
  setupHexMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { useHexPackageLatestStable } from './useHexPackageLatestStable.js';

beforeEach(setupHexMocks);

describe('useHexPackageLatestStable', () => {
  it('returns the latest stable version string', async () => {
    mockPackageLatestStable.mockResolvedValue(version);

    const { result } = renderHook(() => useHexPackageLatestStable(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe(version);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
  });

  it('returns API errors', async () => {
    mockPackageLatestStable.mockRejectedValue(new HexApiError(404, 'Not Found'));

    const { result } = renderHook(() => useHexPackageLatestStable(packageName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(HexApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useHexPackageLatestStable(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useHexPackageLatestStable(packageName, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageLatestStable.mockResolvedValue(version);
    const { result } = renderHook(
      () => useHexPackageLatestStable(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
