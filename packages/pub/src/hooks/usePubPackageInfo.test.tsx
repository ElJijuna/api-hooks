import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PubApiError } from 'pub-api-client';
import {
  mockPackage,
  mockPackageInfo,
  packageInfo,
  packageName,
  setupPubMocks,
  wrapper,
} from '../../testUtils.js';
import { usePubPackageInfo } from './usePubPackageInfo.js';

beforeEach(setupPubMocks);

describe('usePubPackageInfo', () => {
  it('returns package info', async () => {
    mockPackageInfo.mockResolvedValue(packageInfo);

    const { result } = renderHook(() => usePubPackageInfo(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(packageInfo);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
  });

  it('returns API errors', async () => {
    mockPackageInfo.mockRejectedValue(new PubApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePubPackageInfo(packageName), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PubApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => usePubPackageInfo(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => usePubPackageInfo(packageName, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageInfo.mockResolvedValue(packageInfo);
    const { result } = renderHook(
      () => usePubPackageInfo(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
