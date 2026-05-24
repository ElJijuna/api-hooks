import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, type GitHubRepositoryAdvisory } from 'gh-api-client';
import { useGhUpdateRepoAdvisory } from './useGhUpdateRepoAdvisory.js';

const mockUpdateAdvisory = jest.fn<
  (ghsaId: string, data: object) => Promise<GitHubRepositoryAdvisory>
>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      updateAdvisory: mockUpdateAdvisory,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdateRepoAdvisory', () => {
  it('updates a repo advisory', async () => {
    const advisory = { ghsa_id: 'GHSA-1234-5678-9abc' } as unknown as GitHubRepositoryAdvisory;
    mockUpdateAdvisory.mockResolvedValue(advisory);

    const { result } = renderHook(() => useGhUpdateRepoAdvisory('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({
        ghsaId: 'GHSA-1234-5678-9abc',
        data: { severity: 'high' },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(advisory);
    expect(mockUpdateAdvisory).toHaveBeenCalledWith('GHSA-1234-5678-9abc', { severity: 'high' });
  });
});
