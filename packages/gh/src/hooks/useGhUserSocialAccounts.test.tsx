import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubClient, type SocialAccount } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUserSocialAccounts } from './useGhUserSocialAccounts.js';

const mockSocialAccounts = jest.fn<(signal?: AbortSignal) => Promise<SocialAccount[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'user').mockReturnValue({
    socialAccounts: mockSocialAccounts,
  } as unknown as ReturnType<GitHubClient['user']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserSocialAccounts', () => {
  it('returns social accounts on success', async () => {
    const accounts = [{ provider: 'npm', url: 'https://www.npmjs.com/~octocat' }];
    mockSocialAccounts.mockResolvedValue(accounts);

    const { result } = renderHook(() => useGhUserSocialAccounts('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(accounts);
    expect(mockSocialAccounts).toHaveBeenCalledWith(expect.anything());
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserSocialAccounts(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSocialAccounts).not.toHaveBeenCalled();
  });
});
