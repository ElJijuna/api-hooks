import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient } from 'npmjs-api-client';
import { useNpmMaintainerAvatar } from './useNpmMaintainerAvatar.js';

const mockAvatar = jest.fn<() => Promise<string | undefined>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'maintainer')
    .mockReturnValue({
      avatar: mockAvatar,
    } as ReturnType<NpmClient['maintainer']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmMaintainerAvatar', () => {
  it('returns the avatar URL for a username', async () => {
    mockAvatar.mockResolvedValue('https://www.gravatar.com/avatar/hash');

    const { result } = renderHook(() => useNpmMaintainerAvatar('sindresorhus'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe('https://www.gravatar.com/avatar/hash');
    expect(result.current.isError).toBe(false);
  });

  it('calls maintainer with the provided username', async () => {
    mockAvatar.mockResolvedValue('https://www.gravatar.com/avatar/hash');

    renderHook(() => useNpmMaintainerAvatar('sindresorhus'), { wrapper });

    await waitFor(() => expect(mockAvatar).toHaveBeenCalled());

    expect(NpmClient.prototype.maintainer).toHaveBeenCalledWith('sindresorhus');
    expect(mockAvatar).toHaveBeenCalledWith(expect.anything());
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(() => useNpmMaintainerAvatar(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockAvatar).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmMaintainerAvatar('sindresorhus', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockAvatar).not.toHaveBeenCalled();
  });
});
