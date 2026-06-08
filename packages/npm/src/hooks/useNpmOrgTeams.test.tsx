import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmOrgTeams } from './useNpmOrgTeams.js';

const mockTeams = jest.fn<() => Promise<string[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'org')
    .mockReturnValue({ teams: mockTeams } as ReturnType<NpmClient['org']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmOrgTeams', () => {
  it('returns org teams', async () => {
    mockTeams.mockResolvedValue(['npmcli:cli']);

    const { result } = renderHook(() => useNpmOrgTeams('npmcli'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(['npmcli:cli']);
    expect(NpmClient.prototype.org).toHaveBeenCalledWith('npmcli');
    expect(mockTeams).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockTeams.mockRejectedValue(new NpmApiError(403, 'Forbidden'));

    const { result } = renderHook(() => useNpmOrgTeams('npmcli'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when org is empty', () => {
    const { result } = renderHook(() => useNpmOrgTeams(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTeams).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmOrgTeams('npmcli', { enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTeams).not.toHaveBeenCalled();
  });
});
