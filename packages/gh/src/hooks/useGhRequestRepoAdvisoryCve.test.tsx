import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubClient, type GitHubRepositoryAdvisory } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRequestRepoAdvisoryCve } from './useGhRequestRepoAdvisoryCve.js';

const mockRequestCve = jest.fn<(ghsaId: string) => Promise<GitHubRepositoryAdvisory>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    requestCve: mockRequestCve,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRequestRepoAdvisoryCve', () => {
  it('requests a CVE for a repo advisory', async () => {
    const advisory = { ghsa_id: 'GHSA-1234-5678-9abc' } as unknown as GitHubRepositoryAdvisory;
    mockRequestCve.mockResolvedValue(advisory);

    const { result } = renderHook(() => useGhRequestRepoAdvisoryCve('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ ghsaId: 'GHSA-1234-5678-9abc' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(advisory);
    expect(mockRequestCve).toHaveBeenCalledWith('GHSA-1234-5678-9abc');
  });
});
