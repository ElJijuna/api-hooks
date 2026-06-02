import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubPullRequestFile,
} from 'gh-api-client';
import { useGhPullRequestFiles } from './useGhPullRequestFiles.js';

const mockFiles =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubPullRequestFile>>
  >();
const mockPullRequest = jest.fn().mockReturnValue({ files: mockFiles });

beforeEach(() => {
  jest.clearAllMocks();
  mockPullRequest.mockReturnValue({ files: mockFiles });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ pullRequest: mockPullRequest } as unknown as ReturnType<
      GitHubClient['repo']
    >);
});

const mockPrFile = {
  sha: 'abc123',
  filename: 'src/index.ts',
  status: 'modified',
  additions: 1,
  deletions: 0,
  changes: 1,
  blob_url: '',
  raw_url: '',
  contents_url: '',
  patch: '',
} as unknown as GitHubPullRequestFile;
const mockResponse: GitHubPagedResponse<GitHubPullRequestFile> = {
  values: [mockPrFile],
  hasNextPage: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhPullRequestFiles', () => {
  it('returns data on success', async () => {
    mockFiles.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhPullRequestFiles('octocat', 'Hello-World', 42), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockPullRequest).toHaveBeenCalledWith(42);
    expect(mockFiles).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockFiles.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(
      () => useGhPullRequestFiles('octocat', 'Hello-World', 42, params),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFiles).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockFiles.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhPullRequestFiles('octocat', 'Hello-World', 42), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhPullRequestFiles('octocat', 'Hello-World', 42, undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockFiles).not.toHaveBeenCalled();
  });
});
