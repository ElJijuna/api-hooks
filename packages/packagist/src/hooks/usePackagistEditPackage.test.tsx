import { beforeEach, describe, expect, it } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';
import { mockEditPackage, packageName, setupPackagistMocks, wrapper } from '../../testUtils.js';
import { usePackagistEditPackage } from './usePackagistEditPackage.js';

beforeEach(setupPackagistMocks);

describe('usePackagistEditPackage', () => {
  it('returns mutation response', async () => {
    mockEditPackage.mockResolvedValue({ status: 'ok' });

    const { result } = renderHook(() => usePackagistEditPackage(), { wrapper });

    act(() => {
      result.current.mutate({
        name: packageName,
        repository: 'https://github.com/vendor/new-package',
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ status: 'ok' });
    expect(mockEditPackage).toHaveBeenCalledWith(
      packageName,
      'https://github.com/vendor/new-package',
    );
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => usePackagistEditPackage(), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
