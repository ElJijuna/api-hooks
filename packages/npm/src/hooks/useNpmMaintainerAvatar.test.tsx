import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient } from 'npmjs-api-client';
import { useNpmMaintainerAvatar } from './useNpmMaintainerAvatar.js';

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'maintainer')
    .mockReturnValue({
      avatar: () => 'https://www.npmjs.com/npm-avatar/sindresorhus',
    } as ReturnType<NpmClient['maintainer']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmMaintainerAvatar', () => {
  it('returns the avatar URL for a username', () => {
    const { result } = renderHook(() => useNpmMaintainerAvatar('sindresorhus'), { wrapper });

    expect(result.current).toBe('https://www.npmjs.com/npm-avatar/sindresorhus');
  });

  it('calls maintainer with the provided username', () => {
    renderHook(() => useNpmMaintainerAvatar('sindresorhus'), { wrapper });

    expect(NpmClient.prototype.maintainer).toHaveBeenCalledWith('sindresorhus');
  });
});
