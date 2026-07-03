import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PubApiError } from 'pub-api-client';
import {
  mockPackage,
  mockPackageVersions,
  packageName,
  setupPubMocks,
  versionInfo,
  wrapper,
} from '../../testUtils.js';
import { usePubPackageVersions } from './usePubPackageVersions.js';

beforeEach(setupPubMocks);

describe('usePubPackageVersions', () => {
  it('returns the version list', async () => {
    mockPackageVersions.mockResolvedValue([versionInfo]);

    const { result } = renderHook(() => usePubPackageVersions(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([versionInfo]);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
  });

  it('returns API errors', async () => {
    mockPackageVersions.mockRejectedValue(new PubApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePubPackageVersions(packageName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PubApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => usePubPackageVersions(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => usePubPackageVersions(packageName, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageVersions.mockResolvedValue([versionInfo]);
    const { result } = renderHook(
      () => usePubPackageVersions(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
