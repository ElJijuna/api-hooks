import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhGraphql } from './useGhGraphql.js';

const mockGraphql =
  jest.fn<
    <T>(query: string, variables?: Record<string, unknown>, signal?: AbortSignal) => Promise<T>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'graphql').mockImplementation(mockGraphql);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhGraphql', () => {
  it('returns GraphQL data on success', async () => {
    const data = { viewer: { login: 'octocat' } };
    mockGraphql.mockResolvedValue(data);

    const { result } = renderHook(
      () => useGhGraphql<typeof data>('query Viewer { viewer { login } }', { first: 1 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(data);
    expect(mockGraphql).toHaveBeenCalledWith(
      'query Viewer { viewer { login } }',
      { first: 1 },
      expect.anything(),
    );
  });

  it('does not fetch when query is empty', () => {
    const { result } = renderHook(() => useGhGraphql(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGraphql).not.toHaveBeenCalled();
  });
});
