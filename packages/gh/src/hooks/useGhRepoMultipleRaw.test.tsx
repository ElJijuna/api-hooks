import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoMultipleRaw } from './useGhRepoMultipleRaw.js';

const mockMultipleRaw =
  jest.fn<
    (filePaths: string[], params?: object, signal?: AbortSignal) => Promise<Record<string, string>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    multipleRaw: mockMultipleRaw,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoMultipleRaw', () => {
  it('returns multiple raw file contents on success', async () => {
    const files = {
      'README.md': '# Hello World\n',
      'src/index.ts': 'export {};\n',
    };
    mockMultipleRaw.mockResolvedValue(files);

    const { result } = renderHook(
      () => useGhRepoMultipleRaw('owner', 'repo', ['README.md', 'src/index.ts']),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(files);
    expect(result.current.isError).toBe(false);
    expect(mockMultipleRaw).toHaveBeenCalledWith(
      ['README.md', 'src/index.ts'],
      undefined,
      expect.anything(),
    );
  });

  it('passes content params', async () => {
    mockMultipleRaw.mockResolvedValue({ 'README.md': '# Main\n' });

    const { result } = renderHook(
      () => useGhRepoMultipleRaw('owner', 'repo', ['README.md'], { ref: 'main' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockMultipleRaw).toHaveBeenCalledWith(['README.md'], { ref: 'main' }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockMultipleRaw.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhRepoMultipleRaw('owner', 'repo', ['missing.md']), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when filePaths is empty', () => {
    const { result } = renderHook(() => useGhRepoMultipleRaw('owner', 'repo', []), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockMultipleRaw).not.toHaveBeenCalled();
  });

  it('does not fetch when any file path is empty', () => {
    const { result } = renderHook(() => useGhRepoMultipleRaw('owner', 'repo', ['README.md', '']), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockMultipleRaw).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoMultipleRaw('owner', 'repo', ['README.md'], undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockMultipleRaw).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    const files = { 'README.md': '# Hello World\n', 'src/index.ts': 'export {};' };
    mockMultipleRaw.mockResolvedValue(files);
    const { result } = renderHook(
      () =>
        useGhRepoMultipleRaw('owner', 'repo', ['README.md', 'src/index.ts'], {
          queryOptions: { staleTime: 0 },
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
