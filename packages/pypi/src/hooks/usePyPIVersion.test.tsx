import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  mockPackage,
  mockVersion,
  mockVersionGet,
  setupPyPIMocks,
  versionInfo,
  wrapper,
} from '../../testUtils.js';
import { usePyPIVersion } from './usePyPIVersion.js';

beforeEach(setupPyPIMocks);

describe('usePyPIVersion', () => {
  it('returns version data', async () => {
    mockVersionGet.mockResolvedValue(versionInfo);

    const { result } = renderHook(() => usePyPIVersion('requests', '2.31.0'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(versionInfo));
    expect(mockVersion).toHaveBeenCalledWith('2.31.0');
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => usePyPIVersion('requests', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });
});
