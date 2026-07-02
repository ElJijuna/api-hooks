import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  mockVersionVulnerabilities,
  setupPyPIMocks,
  vulnerability,
  wrapper,
} from '../../testUtils.js';
import { usePyPIVersionVulnerabilities } from './usePyPIVersionVulnerabilities.js';

beforeEach(setupPyPIMocks);

describe('usePyPIVersionVulnerabilities', () => {
  it('returns version vulnerabilities', async () => {
    mockVersionVulnerabilities.mockResolvedValue([vulnerability]);

    const { result } = renderHook(() => usePyPIVersionVulnerabilities('requests', '2.31.0'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual([vulnerability]));
  });

  it('accepts queryOptions', async () => {
    mockVersionVulnerabilities.mockResolvedValue([vulnerability]);
    const { result } = renderHook(
      () => usePyPIVersionVulnerabilities('requests', '2.31.0', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
