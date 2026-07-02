import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { MavenApiError } from 'maven-api-client';
import {
  artifactId,
  groupId,
  mockArtifact,
  mockArtifactLatest,
  setupMavenMocks,
  versionDoc,
  wrapper,
} from '../../testUtils.js';
import { useMavenArtifactLatest } from './useMavenArtifactLatest.js';

beforeEach(setupMavenMocks);

describe('useMavenArtifactLatest', () => {
  it('returns the latest version metadata', async () => {
    mockArtifactLatest.mockResolvedValue(versionDoc);

    const { result } = renderHook(() => useMavenArtifactLatest(groupId, artifactId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(versionDoc);
    expect(mockArtifact).toHaveBeenCalledWith(groupId, artifactId);
  });

  it('returns API errors', async () => {
    mockArtifactLatest.mockRejectedValue(new MavenApiError(404, 'Not Found'));

    const { result } = renderHook(() => useMavenArtifactLatest(groupId, artifactId), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(MavenApiError);
  });

  it('does not fetch when artifactId is empty', () => {
    const { result } = renderHook(() => useMavenArtifactLatest(groupId, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockArtifact).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useMavenArtifactLatest(groupId, artifactId, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockArtifact).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockArtifactLatest.mockResolvedValue(versionDoc);
    const { result } = renderHook(
      () => useMavenArtifactLatest(groupId, artifactId, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
