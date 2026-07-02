import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { file, mockVersionFiles, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIVersionFiles } from './usePyPIVersionFiles.js';

beforeEach(setupPyPIMocks);

describe('usePyPIVersionFiles', () => {
  it('returns version files', async () => {
    mockVersionFiles.mockResolvedValue([file]);

    const { result } = renderHook(() => usePyPIVersionFiles('requests', '2.31.0'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual([file]));
  });

  it('accepts queryOptions', async () => {
    mockVersionFiles.mockResolvedValue([file]);
    const { result } = renderHook(
      () => usePyPIVersionFiles('requests', '2.31.0', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
