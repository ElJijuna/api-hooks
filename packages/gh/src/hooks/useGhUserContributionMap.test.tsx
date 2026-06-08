import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ContributionCalendar, GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUserContributionMap } from './useGhUserContributionMap.js';

const mockContributionMap =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<ContributionCalendar>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'user').mockReturnValue({
    contributionMap: mockContributionMap,
  } as unknown as ReturnType<GitHubClient['user']>);
});

const mockCalendar: ContributionCalendar = {
  totalContributions: 365,
  weeks: [
    {
      contributionDays: [{ date: '2024-01-01', contributionCount: 3, color: '#216e39' }],
    },
  ],
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserContributionMap', () => {
  it('returns data on success', async () => {
    mockContributionMap.mockResolvedValue(mockCalendar);

    const { result } = renderHook(() => useGhUserContributionMap('octocat', undefined, {}), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockCalendar);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockContributionMap.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useGhUserContributionMap('octocat', undefined, {}), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserContributionMap(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockContributionMap).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserContributionMap('octocat', undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockContributionMap).not.toHaveBeenCalled();
  });
});
