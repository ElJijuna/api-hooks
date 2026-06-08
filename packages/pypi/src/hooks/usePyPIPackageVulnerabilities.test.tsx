import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  mockPackageVulnerabilities,
  setupPyPIMocks,
  vulnerability,
  wrapper,
} from '../../testUtils.js';
import { usePyPIPackageVulnerabilities } from './usePyPIPackageVulnerabilities.js';

beforeEach(setupPyPIMocks);

describe('usePyPIPackageVulnerabilities', () => {
  it('returns package vulnerabilities', async () => {
    mockPackageVulnerabilities.mockResolvedValue([vulnerability]);

    const { result } = renderHook(() => usePyPIPackageVulnerabilities('requests'), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual([vulnerability]));
  });
});
