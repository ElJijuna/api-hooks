import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { breakdown, mockDownloadsByMirrors, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIDownloadsByMirrors } from './usePyPIDownloadsByMirrors.js';

beforeEach(setupPyPIMocks);

describe('usePyPIDownloadsByMirrors', () => {
  it('returns mirror download breakdown with params', async () => {
    const params = { start_date: '2024-01-01', end_date: '2024-01-31' };
    mockDownloadsByMirrors.mockResolvedValue(breakdown);

    const { result } = renderHook(() => usePyPIDownloadsByMirrors('requests', { params }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(breakdown));
    expect(mockDownloadsByMirrors).toHaveBeenCalledWith(params, expect.anything());
  });

  it('accepts queryOptions', async () => {
    mockDownloadsByMirrors.mockResolvedValue(breakdown);
    const { result } = renderHook(
      () => usePyPIDownloadsByMirrors('requests', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
