import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { breakdown, mockDownloadsByPythonMinor, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIDownloadsByPythonMinor } from './usePyPIDownloadsByPythonMinor.js';

beforeEach(setupPyPIMocks);

describe('usePyPIDownloadsByPythonMinor', () => {
  it('returns Python minor download breakdown with params', async () => {
    const params = { start_date: '2024-01-01', end_date: '2024-01-31' };
    mockDownloadsByPythonMinor.mockResolvedValue(breakdown);

    const { result } = renderHook(() => usePyPIDownloadsByPythonMinor('requests', { params }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(breakdown));
    expect(mockDownloadsByPythonMinor).toHaveBeenCalledWith(params, expect.anything());
  });
});
