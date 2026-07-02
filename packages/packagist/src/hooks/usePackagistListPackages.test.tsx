import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { mockListPackages, setupPackagistMocks, wrapper } from '../../testUtils.js';
import { usePackagistListPackages } from './usePackagistListPackages.js';

beforeEach(setupPackagistMocks);

describe('usePackagistListPackages', () => {
  it('returns package list', async () => {
    const response = { packageNames: ['monolog/monolog'] };
    mockListPackages.mockResolvedValue(response);

    const params = { vendor: 'monolog' };
    const { result } = renderHook(() => usePackagistListPackages(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(response);
    expect(mockListPackages).toHaveBeenCalledWith(params, expect.anything());
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => usePackagistListPackages(undefined, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockListPackages).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockListPackages.mockResolvedValue({ packageNames: ['monolog/monolog'] });
    const { result } = renderHook(
      () => usePackagistListPackages({ vendor: 'monolog' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
