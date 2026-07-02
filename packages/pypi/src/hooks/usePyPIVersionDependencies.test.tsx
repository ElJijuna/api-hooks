import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { dependencies, mockVersionDependencies, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIVersionDependencies } from './usePyPIVersionDependencies.js';

beforeEach(setupPyPIMocks);

describe('usePyPIVersionDependencies', () => {
  it('returns version dependencies', async () => {
    mockVersionDependencies.mockResolvedValue(dependencies);

    const { result } = renderHook(() => usePyPIVersionDependencies('requests', '2.31.0'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual(dependencies));
  });

  it('accepts queryOptions', async () => {
    mockVersionDependencies.mockResolvedValue(dependencies);
    const { result } = renderHook(
      () => usePyPIVersionDependencies('requests', '2.31.0', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
