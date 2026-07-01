import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, type NpmAuthenticatedUser, NpmClient } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmUser } from './useNpmUser.js';

const mockGet = jest.fn<() => Promise<NpmAuthenticatedUser>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'user').mockReturnValue({
    get: mockGet,
  } as ReturnType<NpmClient['user']>);
});

const mockUser: NpmAuthenticatedUser = {
  name: 'pilmee',
  email: 'pilmee@gmail.com',
} as NpmAuthenticatedUser;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmUser', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useNpmUser('pilmee'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmUser('nonexistent-user-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(() => useNpmUser(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmUser('pilmee', { enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockGet.mockResolvedValue(mockUser);
    const { result } = renderHook(() => useNpmUser('pilmee', { queryOptions: { staleTime: 0 } }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
