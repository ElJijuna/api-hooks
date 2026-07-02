import { beforeEach, describe, expect, it } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';
import { mockUpdatePackage, setupPackagistMocks, wrapper } from '../../testUtils.js';
import { usePackagistUpdatePackage } from './usePackagistUpdatePackage.js';

beforeEach(setupPackagistMocks);

describe('usePackagistUpdatePackage', () => {
  it('returns update response', async () => {
    mockUpdatePackage.mockResolvedValue({ status: 'ok', jobs: ['job-1'] });

    const { result } = renderHook(() => usePackagistUpdatePackage(), { wrapper });

    act(() => {
      result.current.mutate('https://packagist.org/packages/vendor/package');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ status: 'ok', jobs: ['job-1'] });
    expect(mockUpdatePackage).toHaveBeenCalledWith('https://packagist.org/packages/vendor/package');
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => usePackagistUpdatePackage(), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });

  it('accepts mutationOptions', async () => {
    mockUpdatePackage.mockResolvedValue({ status: 'ok', jobs: ['job-1'] });
    const { result } = renderHook(
      () => usePackagistUpdatePackage({ mutationOptions: { retry: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isIdle).toBe(true));
  });
});
