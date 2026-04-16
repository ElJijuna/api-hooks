import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmUser } from 'npmjs-api-client';
import { useNpmMaintainer } from './useNpmMaintainer.js';

const mockInfo = jest.fn<() => Promise<NpmUser>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'maintainer')
    .mockReturnValue({
      info: mockInfo,
    } as ReturnType<NpmClient['maintainer']>);
});

const mockUser: NpmUser = {
  name: 'pilmee',
  email: 'pilmee@gmail.com',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmMaintainer', () => {
  it('returns data on success', async () => {
    mockInfo.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useNpmMaintainer('pilmee'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error when user has no published packages', async () => {
    mockInfo.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmMaintainer('nonexistent-user-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(() => useNpmMaintainer(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockInfo).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmMaintainer('pilmee', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockInfo).not.toHaveBeenCalled();
  });
});
