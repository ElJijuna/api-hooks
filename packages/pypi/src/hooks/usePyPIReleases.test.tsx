import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { mockReleases, project, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIReleases } from './usePyPIReleases.js';

beforeEach(setupPyPIMocks);

describe('usePyPIReleases', () => {
  it('returns releases', async () => {
    mockReleases.mockResolvedValue(project.releases);

    const { result } = renderHook(() => usePyPIReleases('requests'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(project.releases));
  });

  it('accepts queryOptions', async () => {
    mockReleases.mockResolvedValue(project.releases);
    const { result } = renderHook(
      () => usePyPIReleases('requests', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
