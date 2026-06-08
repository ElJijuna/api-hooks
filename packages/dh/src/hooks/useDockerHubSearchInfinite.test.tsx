import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  DockerHubClient,
  type DockerHubPagedResponse,
  type DockerHubSearchResult,
} from 'dockerhub-api-client';
import type { ReactNode } from 'react';
import { useDockerHubSearchInfinite } from './useDockerHubSearchInfinite.js';

const mockSearch = jest.fn<() => Promise<DockerHubPagedResponse<DockerHubSearchResult>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(DockerHubClient.prototype, 'search').mockImplementation(mockSearch);
});

const mockPage1: DockerHubPagedResponse<DockerHubSearchResult> = {
  results: [{ repo_name: 'library/nginx' } as DockerHubSearchResult],
  count: 2,
  hasNextPage: true,
  nextPage: 2,
};

const mockPage2: DockerHubPagedResponse<DockerHubSearchResult> = {
  results: [{ repo_name: 'nginxinc/nginx-unprivileged' } as DockerHubSearchResult],
  count: 2,
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubSearchInfinite', () => {
  it('fetches first page on mount', async () => {
    mockSearch.mockResolvedValue(mockPage1);

    const { result } = renderHook(() => useDockerHubSearchInfinite('nginx'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages[0]).toEqual(mockPage1);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('fetches next page on fetchNextPage', async () => {
    mockSearch.mockResolvedValueOnce(mockPage1).mockResolvedValueOnce(mockPage2);

    const { result } = renderHook(() => useDockerHubSearchInfinite('nginx'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages.length).toBe(2));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('does not fetch when query is empty', () => {
    const { result } = renderHook(() => useDockerHubSearchInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
