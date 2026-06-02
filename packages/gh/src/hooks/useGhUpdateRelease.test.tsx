import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubRelease,
  type UpdateReleaseData,
} from 'gh-api-client';
import { useGhUpdateRelease } from './useGhUpdateRelease.js';

const mockUpdateRelease =
  jest.fn<(id: number, data: UpdateReleaseData) => Promise<GitHubRelease>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    updateRelease: mockUpdateRelease,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRelease = {
  id: 1,
  tag_name: 'v1.0.0',
  name: 'Release 1.0',
  draft: false,
  prerelease: false,
} as unknown as GitHubRelease;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdateRelease', () => {
  it('returns updated release on success', async () => {
    mockUpdateRelease.mockResolvedValue(mockRelease);

    const { result } = renderHook(() => useGhUpdateRelease('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ releaseId: 1, data: { name: 'Release 1.0' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockRelease);
    expect(mockUpdateRelease).toHaveBeenCalledWith(1, { name: 'Release 1.0' });
  });

  it('returns error on failure', async () => {
    mockUpdateRelease.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUpdateRelease('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ releaseId: 99, data: { name: 'Test' } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhUpdateRelease('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
