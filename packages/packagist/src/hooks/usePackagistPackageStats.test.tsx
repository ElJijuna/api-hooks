import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  mockPackageStats,
  packageName,
  setupPackagistMocks,
  statsResponse,
  wrapper,
} from '../../testUtils.js';
import { usePackagistPackageStats } from './usePackagistPackageStats.js';

beforeEach(setupPackagistMocks);

describe('usePackagistPackageStats', () => {
  it('returns package stats', async () => {
    mockPackageStats.mockResolvedValue(statsResponse);

    const { result } = renderHook(() => usePackagistPackageStats(packageName), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(statsResponse);
    expect(mockPackageStats).toHaveBeenCalledWith(expect.anything());
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => usePackagistPackageStats(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackageStats).not.toHaveBeenCalled();
  });
});
