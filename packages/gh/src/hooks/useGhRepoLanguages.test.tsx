import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError } from 'gh-api-client';
import { useGhRepoLanguages, type RepoLanguages } from './useGhRepoLanguages.js';

const mockLanguages = jest.fn<(signal?: AbortSignal) => Promise<RepoLanguages>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      languages: mockLanguages,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockResponse: RepoLanguages = { TypeScript: 45231, CSS: 3210, HTML: 1200 };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoLanguages', () => {
  it('returns data on success', async () => {
    mockLanguages.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoLanguages('owner', 'repo'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockLanguages.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhRepoLanguages('owner', 'repo'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoLanguages('', 'repo'), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockLanguages).not.toHaveBeenCalled();
  });

  it('does not fetch when repo is empty', () => {
    const { result } = renderHook(() => useGhRepoLanguages('owner', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockLanguages).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhRepoLanguages('owner', 'repo', { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockLanguages).not.toHaveBeenCalled();
  });
});
