import { beforeEach, describe, expect, it } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';
import { PackagistApiError } from 'php-packagist-api-client';
import { mockCreatePackage, setupPackagistMocks, wrapper } from '../../testUtils.js';
import { usePackagistCreatePackage } from './usePackagistCreatePackage.js';

beforeEach(setupPackagistMocks);

describe('usePackagistCreatePackage', () => {
  it('returns mutation response', async () => {
    mockCreatePackage.mockResolvedValue({ status: 'ok' });

    const { result } = renderHook(() => usePackagistCreatePackage(), { wrapper });

    act(() => {
      result.current.mutate('https://github.com/vendor/package');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ status: 'ok' });
    expect(mockCreatePackage).toHaveBeenCalledWith('https://github.com/vendor/package');
  });

  it('returns mutation errors', async () => {
    mockCreatePackage.mockRejectedValue(new PackagistApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => usePackagistCreatePackage(), { wrapper });

    act(() => {
      result.current.mutate('https://github.com/vendor/package');
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PackagistApiError);
  });

  it('accepts mutationOptions', async () => {
    mockCreatePackage.mockResolvedValue({ status: 'ok' });
    const { result } = renderHook(
      () => usePackagistCreatePackage({ mutationOptions: { retry: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isIdle).toBe(true));
  });
});
