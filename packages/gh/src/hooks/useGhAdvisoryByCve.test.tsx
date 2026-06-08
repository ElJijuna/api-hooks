import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type GitHubAdvisory, GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhAdvisoryByCve } from './useGhAdvisoryByCve.js';

const mockAdvisoryByCve =
  jest.fn<(cveId: string, signal?: AbortSignal) => Promise<GitHubAdvisory | null>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'advisoryByCve').mockImplementation(mockAdvisoryByCve);
});

const mockData = {
  ghsa_id: 'GHSA-1234-5678-9abc',
  cve_id: 'CVE-2021-44228',
} as unknown as GitHubAdvisory;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAdvisoryByCve', () => {
  it('returns data on success', async () => {
    mockAdvisoryByCve.mockResolvedValue(mockData);

    const { result } = renderHook(() => useGhAdvisoryByCve('CVE-2021-44228'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(mockAdvisoryByCve).toHaveBeenCalledWith('CVE-2021-44228', expect.anything());
  });

  it('returns null when no advisory is found for the CVE', async () => {
    mockAdvisoryByCve.mockResolvedValue(null);

    const { result } = renderHook(() => useGhAdvisoryByCve('CVE-0000-00000'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockAdvisoryByCve.mockRejectedValue(new GitHubApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useGhAdvisoryByCve('CVE-2021-44228'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when cveId is empty', () => {
    const { result } = renderHook(() => useGhAdvisoryByCve(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockAdvisoryByCve).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhAdvisoryByCve('CVE-2021-44228', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockAdvisoryByCve).not.toHaveBeenCalled();
  });
});
