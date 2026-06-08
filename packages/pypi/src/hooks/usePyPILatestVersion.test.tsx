import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  mockLatest,
  mockLatestGet,
  setupPyPIMocks,
  versionInfo,
  wrapper,
} from '../../testUtils.js';
import { usePyPILatestVersion } from './usePyPILatestVersion.js';

beforeEach(setupPyPIMocks);

describe('usePyPILatestVersion', () => {
  it('returns latest version data', async () => {
    mockLatestGet.mockResolvedValue(versionInfo);

    const { result } = renderHook(() => usePyPILatestVersion('requests'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(versionInfo));
    expect(mockLatest).toHaveBeenCalled();
  });
});
