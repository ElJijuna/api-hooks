import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { NuGetApiError } from 'nuget-api-client';
import {
  mockPackage,
  mockPackageVersions,
  packageId,
  setupNuGetMocks,
  wrapper,
} from '../../testUtils.js';
import { useNuGetPackageVersions } from './useNuGetPackageVersions.js';

beforeEach(setupNuGetMocks);

describe('useNuGetPackageVersions', () => {
  it('returns the version list', async () => {
    mockPackageVersions.mockResolvedValue(['12.0.3', '13.0.3']);

    const { result } = renderHook(() => useNuGetPackageVersions(packageId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(['12.0.3', '13.0.3']);
    expect(mockPackage).toHaveBeenCalledWith(packageId);
  });

  it('returns API errors', async () => {
    mockPackageVersions.mockRejectedValue(new NuGetApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNuGetPackageVersions(packageId), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NuGetApiError);
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useNuGetPackageVersions(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNuGetPackageVersions(packageId, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageVersions.mockResolvedValue(['13.0.3']);
    const { result } = renderHook(
      () => useNuGetPackageVersions(packageId, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
