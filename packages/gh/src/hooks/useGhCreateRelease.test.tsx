import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  type CreateReleaseData,
  GitHubApiError,
  GitHubClient,
  type GitHubRelease,
} from 'gh-api-client';
import { useGhCreateRelease } from './useGhCreateRelease.js';

const mockCreateRelease = jest.fn<(data: CreateReleaseData) => Promise<GitHubRelease>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    createRelease: mockCreateRelease,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRelease = {
  id: 1,
  tag_name: 'v1.0.0',
  name: 'v1.0.0',
  body: '',
  draft: false,
  prerelease: false,
} as unknown as GitHubRelease;

const releaseData: CreateReleaseData = { tag_name: 'v1.0.0', name: 'v1.0.0' };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateRelease', () => {
  it('returns created release on success', async () => {
    mockCreateRelease.mockResolvedValue(mockRelease);

    const { result } = renderHook(() => useGhCreateRelease('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(releaseData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockRelease);
    expect(mockCreateRelease).toHaveBeenCalledWith(releaseData);
  });

  it('returns error on failure', async () => {
    mockCreateRelease.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhCreateRelease('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(releaseData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhCreateRelease('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
