import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import {
  mockPackageSecurityAdvisories,
  packageName,
  securityAdvisoriesResponse,
  setupPackagistMocks,
  wrapper,
} from '../../testUtils.js';
import { usePackagistPackageSecurityAdvisories } from './usePackagistPackageSecurityAdvisories.js';

beforeEach(setupPackagistMocks);

describe('usePackagistPackageSecurityAdvisories', () => {
  it('returns package security advisories', async () => {
    mockPackageSecurityAdvisories.mockResolvedValue(securityAdvisoriesResponse);

    const { result } = renderHook(() => usePackagistPackageSecurityAdvisories(packageName), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(securityAdvisoriesResponse);
    expect(mockPackageSecurityAdvisories).toHaveBeenCalledWith(expect.anything());
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(
      () => usePackagistPackageSecurityAdvisories(packageName, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackageSecurityAdvisories).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPackageSecurityAdvisories.mockResolvedValue(securityAdvisoriesResponse);
    const { result } = renderHook(
      () => usePackagistPackageSecurityAdvisories(packageName, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
