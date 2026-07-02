import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { NuGetApiError } from 'nuget-api-client';
import {
  catalogEntry,
  mockPackage,
  mockPackageLatest,
  packageId,
  setupNuGetMocks,
  wrapper,
} from '../../testUtils.js';
import { useNuGetPackageLatest } from './useNuGetPackageLatest.js';

beforeEach(setupNuGetMocks);

describe('useNuGetPackageLatest', () => {
  it('returns the latest version metadata', async () => {
    mockPackageLatest.mockResolvedValue(catalogEntry);

    const { result } = renderHook(() => useNuGetPackageLatest(packageId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(catalogEntry);
    expect(mockPackage).toHaveBeenCalledWith(packageId);
  });

  it('returns API errors', async () => {
    mockPackageLatest.mockRejectedValue(new NuGetApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNuGetPackageLatest(packageId), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NuGetApiError);
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useNuGetPackageLatest(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNuGetPackageLatest(packageId, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageLatest.mockResolvedValue(catalogEntry);
    const { result } = renderHook(
      () => useNuGetPackageLatest(packageId, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
