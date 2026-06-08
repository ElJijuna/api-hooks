import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { mockPopular, popularResponse, setupPackagistMocks, wrapper } from '../../testUtils.js';
import { usePackagistPopular } from './usePackagistPopular.js';

beforeEach(setupPackagistMocks);

describe('usePackagistPopular', () => {
  it('returns popular packages', async () => {
    mockPopular.mockResolvedValue(popularResponse);

    const params = { page: 2, perPage: 10 };
    const { result } = renderHook(() => usePackagistPopular(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(popularResponse);
    expect(mockPopular).toHaveBeenCalledWith(params, expect.anything());
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => usePackagistPopular(undefined, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPopular).not.toHaveBeenCalled();
  });
});
