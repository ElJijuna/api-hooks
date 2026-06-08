import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PyPIApiError } from 'pypi-api-client';
import { mockPackage, mockProjectGet, project, setupPyPIMocks, wrapper } from '../../testUtils.js';
import { usePyPIProject } from './usePyPIProject.js';

beforeEach(setupPyPIMocks);

describe('usePyPIProject', () => {
  it('returns project data', async () => {
    mockProjectGet.mockResolvedValue(project);

    const { result } = renderHook(() => usePyPIProject('requests'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(project);
    expect(mockPackage).toHaveBeenCalledWith('requests');
    expect(mockProjectGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns API errors', async () => {
    mockProjectGet.mockRejectedValue(new PyPIApiError(404, 'Not Found'));

    const { result } = renderHook(() => usePyPIProject('missing'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(PyPIApiError);
  });

  it('does not fetch when package name is empty', () => {
    const { result } = renderHook(() => usePyPIProject(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => usePyPIProject('requests', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackage).not.toHaveBeenCalled();
  });
});
