import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OsvClient, OsvApiError, type OsvVulnerability } from 'osv-api-client';
import { useOsvVuln } from './useOsvVuln.js';

const mockGet = jest.fn<() => Promise<OsvVulnerability>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(OsvClient.prototype, 'vuln')
    .mockReturnValue({
      get: mockGet,
      then: (onfulfilled: unknown) =>
        mockGet().then(onfulfilled as Parameters<Promise<OsvVulnerability>['then']>[0]),
    } as unknown as ReturnType<OsvClient['vuln']>);
});

const mockVuln: OsvVulnerability = {
  id: 'GHSA-jfh8-c2jp-hdp8',
  published: '2021-12-10T00:00:00Z',
  modified: '2023-01-01T00:00:00Z',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useOsvVuln', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockVuln);

    const { result } = renderHook(() => useOsvVuln('GHSA-jfh8-c2jp-hdp8'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockVuln);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new OsvApiError(404, 'Not Found'));

    const { result } = renderHook(() => useOsvVuln('GHSA-not-found'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(OsvApiError);
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useOsvVuln(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useOsvVuln('GHSA-jfh8-c2jp-hdp8', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
