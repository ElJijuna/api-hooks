import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { breakdown, mockDownloadsBySystem, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIDownloadsBySystem } from './usePyPIDownloadsBySystem.js';

beforeEach(setupPyPIMocks);

describe('usePyPIDownloadsBySystem', () => {
  it('returns system download breakdown with params', async () => {
    const params = { start_date: '2024-01-01', end_date: '2024-01-31' };
    mockDownloadsBySystem.mockResolvedValue(breakdown);

    const { result } = renderHook(() => usePyPIDownloadsBySystem('requests', { params }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(breakdown));
    expect(mockDownloadsBySystem).toHaveBeenCalledWith(params, expect.anything());
  });
});
