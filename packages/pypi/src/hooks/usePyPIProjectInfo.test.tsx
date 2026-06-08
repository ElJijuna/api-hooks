import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { info, mockInfo, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIProjectInfo } from './usePyPIProjectInfo.js';

beforeEach(setupPyPIMocks);

describe('usePyPIProjectInfo', () => {
  it('returns latest project info', async () => {
    mockInfo.mockResolvedValue(info);

    const { result } = renderHook(() => usePyPIProjectInfo('requests'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(info));
  });
});
