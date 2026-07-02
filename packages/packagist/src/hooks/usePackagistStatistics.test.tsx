import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  mockStatistics,
  setupPackagistMocks,
  statisticsResponse,
  wrapper,
} from '../../testUtils.js';
import { usePackagistStatistics } from './usePackagistStatistics.js';

beforeEach(setupPackagistMocks);

describe('usePackagistStatistics', () => {
  it('returns global statistics', async () => {
    mockStatistics.mockResolvedValue(statisticsResponse);

    const { result } = renderHook(() => usePackagistStatistics(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(statisticsResponse);
    expect(mockStatistics).toHaveBeenCalledWith(expect.anything());
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => usePackagistStatistics({ enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockStatistics).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockStatistics.mockResolvedValue(statisticsResponse);
    const { result } = renderHook(
      () => usePackagistStatistics({ queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
