import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  DockerHubApiError,
  DockerHubClient,
  type DockerHubPagedResponse,
  type DockerHubSearchResult,
} from 'dockerhub-api-client';
import { useDockerHubSearch } from './useDockerHubSearch.js';

const mockSearch = jest.fn<() => Promise<DockerHubPagedResponse<DockerHubSearchResult>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(DockerHubClient.prototype, 'search').mockImplementation(mockSearch);
});

const mockResponse: DockerHubPagedResponse<DockerHubSearchResult> = {
  results: [
    {
      repo_name: 'library/nginx',
      short_description: 'Official nginx image',
      is_official: true,
      is_automated: false,
      star_count: 1000,
      pull_count: 1000000000,
    },
  ],
  count: 1,
  hasNextPage: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useDockerHubSearch', () => {
  it('returns data on success', async () => {
    mockSearch.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDockerHubSearch('nginx'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockSearch.mockRejectedValue(new DockerHubApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useDockerHubSearch('nginx'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(DockerHubApiError);
  });

  it('does not fetch when query is empty', () => {
    const { result } = renderHook(() => useDockerHubSearch(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
