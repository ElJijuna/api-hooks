import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PubApiError } from 'pub-api-client';
import {
  mockPackage,
  mockPackageLatest,
  packageName,
  setupPubMocks,
  versionInfo,
  wrapper,
} from '../../testUtils.js';
import { usePubPackageLatest } from './usePubPackageLatest.js';

beforeEach(setupPubMocks);

describe('usePubPackageLatest', () => {
  it('returns the latest version metadata', async () => {
    mockPackageLatest.mockResolvedValue(versionInfo);

    const { result } = renderHook(() => usePubPackageLatest(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(versionInfo);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
  });

  it('returns API errors', async () => {
    mockPackageLatest.mockRejectedValue(new PubApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePubPackageLatest(packageName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PubApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => usePubPackageLatest(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => usePubPackageLatest(packageName, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageLatest.mockResolvedValue(versionInfo);
    const { result } = renderHook(
      () => usePubPackageLatest(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
