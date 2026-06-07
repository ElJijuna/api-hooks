import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmWhoami } from 'npmjs-api-client';
import { useNpmWhoami } from './useNpmWhoami.js';

const mockWhoami = jest.fn<() => Promise<NpmWhoami>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'whoami').mockImplementation(mockWhoami);
});

const mockData: NpmWhoami = { username: 'pilmee' };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmWhoami', () => {
  it('returns data on success', async () => {
    mockWhoami.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmWhoami(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on 401 when token is invalid', async () => {
    mockWhoami.mockRejectedValue(new NpmApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useNpmWhoami(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmWhoami({ enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockWhoami).not.toHaveBeenCalled();
  });
});
