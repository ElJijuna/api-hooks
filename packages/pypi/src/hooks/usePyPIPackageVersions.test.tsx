import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { mockVersions, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIPackageVersions } from './usePyPIPackageVersions.js';

beforeEach(setupPyPIMocks);

describe('usePyPIPackageVersions', () => {
  it('returns package versions', async () => {
    mockVersions.mockResolvedValue(['2.30.0', '2.31.0']);

    const { result } = renderHook(() => usePyPIPackageVersions('requests'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(['2.30.0', '2.31.0']));
  });
});
