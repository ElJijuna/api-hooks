import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { MavenApiError } from 'maven-api-client';
import {
  artifactId,
  groupId,
  mockArtifact,
  mockArtifactVersions,
  setupMavenMocks,
  wrapper,
} from '../../testUtils.js';
import { useMavenArtifactVersions } from './useMavenArtifactVersions.js';

beforeEach(setupMavenMocks);

describe('useMavenArtifactVersions', () => {
  it('returns the version list', async () => {
    mockArtifactVersions.mockResolvedValue(['6.0.0', '6.1.0']);

    const { result } = renderHook(() => useMavenArtifactVersions(groupId, artifactId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(['6.0.0', '6.1.0']);
    expect(mockArtifact).toHaveBeenCalledWith(groupId, artifactId);
  });

  it('returns API errors', async () => {
    mockArtifactVersions.mockRejectedValue(new MavenApiError(404, 'Not Found'));

    const { result } = renderHook(() => useMavenArtifactVersions(groupId, artifactId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(MavenApiError);
  });

  it('does not fetch when groupId is empty', () => {
    const { result } = renderHook(() => useMavenArtifactVersions('', artifactId), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockArtifact).not.toHaveBeenCalled();
  });

  it('does not fetch when artifactId is empty', () => {
    const { result } = renderHook(() => useMavenArtifactVersions(groupId, ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockArtifact).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useMavenArtifactVersions(groupId, artifactId, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockArtifact).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockArtifactVersions.mockResolvedValue(['6.1.0']);
    const { result } = renderHook(
      () => useMavenArtifactVersions(groupId, artifactId, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
