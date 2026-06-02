import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubClient, type GitHubRepositoryAdvisory } from 'gh-api-client';
import { useGhCreateRepoAdvisory } from './useGhCreateRepoAdvisory.js';

const mockCreateAdvisory = jest.fn<(data: object) => Promise<GitHubRepositoryAdvisory>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    createAdvisory: mockCreateAdvisory,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateRepoAdvisory', () => {
  it('creates a repo advisory', async () => {
    const advisory = { ghsa_id: 'GHSA-1234-5678-9abc' } as unknown as GitHubRepositoryAdvisory;
    const data = { summary: 'Issue', description: 'Description' };
    mockCreateAdvisory.mockResolvedValue(advisory);

    const { result } = renderHook(() => useGhCreateRepoAdvisory('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(advisory);
    expect(mockCreateAdvisory).toHaveBeenCalledWith(data);
  });
});
