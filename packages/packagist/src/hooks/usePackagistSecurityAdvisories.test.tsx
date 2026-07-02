import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  mockSecurityAdvisories,
  packageName,
  securityAdvisoriesResponse,
  setupPackagistMocks,
  wrapper,
} from '../../testUtils.js';
import { usePackagistSecurityAdvisories } from './usePackagistSecurityAdvisories.js';

beforeEach(setupPackagistMocks);

describe('usePackagistSecurityAdvisories', () => {
  it('returns security advisories', async () => {
    mockSecurityAdvisories.mockResolvedValue(securityAdvisoriesResponse);

    const params = { packages: [packageName] };
    const { result } = renderHook(() => usePackagistSecurityAdvisories(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(securityAdvisoriesResponse);
    expect(mockSecurityAdvisories).toHaveBeenCalledWith(params, expect.anything());
  });

  it('does not fetch when no filter params are set', () => {
    const { result } = renderHook(() => usePackagistSecurityAdvisories({}), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSecurityAdvisories).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSecurityAdvisories.mockResolvedValue(securityAdvisoriesResponse);
    const { result } = renderHook(
      () =>
        usePackagistSecurityAdvisories(
          { packages: [packageName] },
          { queryOptions: { staleTime: 0 } },
        ),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
