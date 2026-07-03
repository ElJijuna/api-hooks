import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { SwiftPMApiError } from 'swiftpm-api-client';
import {
  mockPackage,
  mockPackageReleases,
  name,
  releasesIndex,
  scope,
  setupSwiftPMMocks,
  wrapper,
} from '../../testUtils.js';
import { useSwiftPMPackageReleases } from './useSwiftPMPackageReleases.js';

beforeEach(setupSwiftPMMocks);

describe('useSwiftPMPackageReleases', () => {
  it('returns the releases index', async () => {
    mockPackageReleases.mockResolvedValue(releasesIndex);

    const { result } = renderHook(() => useSwiftPMPackageReleases(scope, name), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(releasesIndex);
    expect(mockPackage).toHaveBeenCalledWith(scope, name);
  });

  it('returns API errors', async () => {
    mockPackageReleases.mockRejectedValue(new SwiftPMApiError(404, 'Not Found'));

    const { result } = renderHook(() => useSwiftPMPackageReleases(scope, name), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(SwiftPMApiError);
  });

  it('does not fetch when scope is empty', () => {
    const { result } = renderHook(() => useSwiftPMPackageReleases('', name), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useSwiftPMPackageReleases(scope, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useSwiftPMPackageReleases(scope, name, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageReleases.mockResolvedValue(releasesIndex);
    const { result } = renderHook(
      () => useSwiftPMPackageReleases(scope, name, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
