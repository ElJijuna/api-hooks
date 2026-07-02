import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { NuGetApiError } from 'nuget-api-client';
import {
  catalogEntry,
  mockPackage,
  mockPackageVersion,
  packageId,
  setupNuGetMocks,
  version,
  wrapper,
} from '../../testUtils.js';
import { useNuGetPackageVersion } from './useNuGetPackageVersion.js';

beforeEach(setupNuGetMocks);

describe('useNuGetPackageVersion', () => {
  it('returns version metadata', async () => {
    mockPackageVersion.mockResolvedValue(catalogEntry);

    const { result } = renderHook(() => useNuGetPackageVersion(packageId, version), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(catalogEntry);
    expect(mockPackage).toHaveBeenCalledWith(packageId);
    expect(mockPackageVersion).toHaveBeenCalledWith(version, expect.anything());
  });

  it('returns API errors', async () => {
    mockPackageVersion.mockRejectedValue(new NuGetApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNuGetPackageVersion(packageId, version), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NuGetApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useNuGetPackageVersion(packageId, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNuGetPackageVersion(packageId, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageVersion.mockResolvedValue(catalogEntry);
    const { result } = renderHook(
      () => useNuGetPackageVersion(packageId, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
