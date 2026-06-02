import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type GitHubAdvisory, GitHubApiError, GitHubClient } from 'gh-api-client';
import { useGhAdvisory } from './useGhAdvisory.js';

const mockAdvisory = jest.fn<(ghsaId: string, signal?: AbortSignal) => Promise<GitHubAdvisory>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'advisory').mockImplementation(mockAdvisory);
});

const mockData = {
  ghsa_id: 'GHSA-1234-5678-9abc',
  cve_id: 'CVE-2021-44228',
} as unknown as GitHubAdvisory;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAdvisory', () => {
  it('returns data on success', async () => {
    mockAdvisory.mockResolvedValue(mockData);

    const { result } = renderHook(() => useGhAdvisory('GHSA-1234-5678-9abc'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(mockAdvisory).toHaveBeenCalledWith('GHSA-1234-5678-9abc', expect.anything());
  });

  it('returns error on failure', async () => {
    mockAdvisory.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhAdvisory('GHSA-0000-0000-0000'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when ghsaId is empty', () => {
    const { result } = renderHook(() => useGhAdvisory(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockAdvisory).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhAdvisory('GHSA-1234-5678-9abc', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockAdvisory).not.toHaveBeenCalled();
  });
});
