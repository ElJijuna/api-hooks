import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError } from 'npmjs-api-client';
import { useNpmOrgTeamMembers } from './useNpmOrgTeamMembers.js';

const mockTeamMembers = jest.fn<() => Promise<string[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'org')
    .mockReturnValue({ teamMembers: mockTeamMembers } as ReturnType<NpmClient['org']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmOrgTeamMembers', () => {
  it('returns team members', async () => {
    mockTeamMembers.mockResolvedValue(['pilmee']);

    const { result } = renderHook(() => useNpmOrgTeamMembers('npmcli', 'cli'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(['pilmee']);
    expect(NpmClient.prototype.org).toHaveBeenCalledWith('npmcli');
    expect(mockTeamMembers).toHaveBeenCalledWith('cli', expect.anything());
  });

  it('returns error on failure', async () => {
    mockTeamMembers.mockRejectedValue(new NpmApiError(403, 'Forbidden'));

    const { result } = renderHook(() => useNpmOrgTeamMembers('npmcli', 'cli'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when org is empty', () => {
    const { result } = renderHook(() => useNpmOrgTeamMembers('', 'cli'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTeamMembers).not.toHaveBeenCalled();
  });

  it('does not fetch when team is empty', () => {
    const { result } = renderHook(() => useNpmOrgTeamMembers('npmcli', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTeamMembers).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmOrgTeamMembers('npmcli', 'cli', { enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTeamMembers).not.toHaveBeenCalled();
  });
});
