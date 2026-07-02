import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PackagistApiError } from 'php-packagist-api-client';
import {
  mockPackage,
  mockPackageGet,
  packageName,
  packageResponse,
  setupPackagistMocks,
  wrapper,
} from '../../testUtils.js';
import { usePackagistPackage } from './usePackagistPackage.js';

beforeEach(setupPackagistMocks);

describe('usePackagistPackage', () => {
  it('returns package data', async () => {
    mockPackageGet.mockResolvedValue(packageResponse);

    const { result } = renderHook(() => usePackagistPackage(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(packageResponse);
    expect(mockPackage).toHaveBeenCalledWith(packageName);
    expect(mockPackageGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns API errors', async () => {
    mockPackageGet.mockRejectedValue(new PackagistApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePackagistPackage('missing/package'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PackagistApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => usePackagistPackage(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageGet.mockResolvedValue(packageResponse);
    const { result } = renderHook(
      () => usePackagistPackage(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
