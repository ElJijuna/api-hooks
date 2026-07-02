import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { breakdown, mockDownloadsByPythonMajor, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIDownloadsByPythonMajor } from './usePyPIDownloadsByPythonMajor.js';

beforeEach(setupPyPIMocks);

describe('usePyPIDownloadsByPythonMajor', () => {
  it('returns Python major download breakdown with params', async () => {
    const params = { start_date: '2024-01-01', end_date: '2024-01-31' };
    mockDownloadsByPythonMajor.mockResolvedValue(breakdown);

    const { result } = renderHook(() => usePyPIDownloadsByPythonMajor('requests', { params }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(breakdown));
    expect(mockDownloadsByPythonMajor).toHaveBeenCalledWith(params, expect.anything());
  });

  it('accepts queryOptions', async () => {
    mockDownloadsByPythonMajor.mockResolvedValue(breakdown);
    const { result } = renderHook(
      () => usePyPIDownloadsByPythonMajor('requests', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
