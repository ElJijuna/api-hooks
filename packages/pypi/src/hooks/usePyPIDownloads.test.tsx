import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { mockDownloads, recentDownloads, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIDownloads } from './usePyPIDownloads.js';

beforeEach(setupPyPIMocks);

describe('usePyPIDownloads', () => {
  it('returns recent downloads', async () => {
    mockDownloads.mockResolvedValue(recentDownloads);

    const { result } = renderHook(() => usePyPIDownloads('requests'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(recentDownloads));
  });

  it('accepts queryOptions', async () => {
    mockDownloads.mockResolvedValue(recentDownloads);
    const { result } = renderHook(
      () => usePyPIDownloads('requests', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
