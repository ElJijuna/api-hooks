import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PubApiError } from 'pub-api-client';
import {
  mockPackage,
  mockPackageVersion,
  packageName,
  setupPubMocks,
  version,
  versionInfo,
  wrapper,
} from '../../testUtils.js';
import { usePubPackageVersion } from './usePubPackageVersion.js';

beforeEach(setupPubMocks);

describe('usePubPackageVersion', () => {
  it('returns version metadata', async () => {
    mockPackageVersion.mockResolvedValue(versionInfo);

    const { result } = renderHook(() => usePubPackageVersion(packageName, version), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(versionInfo);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
    expect(mockPackageVersion).toHaveBeenCalledWith(version, expect.anything());
  });

  it('returns API errors', async () => {
    mockPackageVersion.mockRejectedValue(new PubApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePubPackageVersion(packageName, version), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PubApiError);
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => usePubPackageVersion(packageName, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => usePubPackageVersion(packageName, version, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageVersion.mockResolvedValue(versionInfo);
    const { result } = renderHook(
      () => usePubPackageVersion(packageName, version, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
