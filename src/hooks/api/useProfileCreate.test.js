import { QueryClient, QueryClientProvider } from 'react-query';
import { useIntl } from 'react-intl';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';
import { useProfileCreate } from './useProfileCreate';
import { BULK_EDIT_PROFILES_KEY } from './useBulkEditProfiles';

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
}));
jest.mock('../useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));
jest.mock('./useBulkEditProfiles', () => ({
  BULK_EDIT_PROFILES_KEY: 'bulk-edit-profiles',
}));

describe('useProfileCreate', () => {
  let queryClient;
  let mockKy;
  let mockCallout;
  let mockFormatMessage;
  let mockShowErrorMessage;
  let mockOnSuccess;
  let wrapper;

  const mockProfile = {
    id: 'profile-123',
    name: 'Test Profile',
    description: 'Test Description'
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockKy = {
      post: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue(mockProfile)
      })
    };

    mockCallout = jest.fn();
    mockFormatMessage = jest.fn((obj) => obj.id);
    mockShowErrorMessage = jest.fn();
    mockOnSuccess = jest.fn();

    useOkapiKy.mockReturnValue(mockKy);
    useShowCallout.mockReturnValue(mockCallout);
    useNamespace.mockReturnValue(['test-namespace']);
    useIntl.mockReturnValue({
      formatMessage: mockFormatMessage
    });
    useErrorMessages.mockReturnValue({
      showErrorMessage: mockShowErrorMessage
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('initialization', () => {
    it('should initialize with correct dependencies', () => {
      renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      expect(useOkapiKy).toHaveBeenCalled();
      expect(useShowCallout).toHaveBeenCalled();
      expect(useNamespace).toHaveBeenCalledWith({ key: BULK_EDIT_PROFILES_KEY });
      expect(useIntl).toHaveBeenCalled();
      expect(useErrorMessages).toHaveBeenCalledWith({
        messageSuffix: 'ui-bulk-edit.settings.profiles.form.create.error'
      });
    });

    it('should return createProfile function and isProfileCreating state', () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      expect(result.current).toHaveProperty('createProfile');
      expect(result.current).toHaveProperty('isProfileCreating');
      expect(typeof result.current.createProfile).toBe('function');
      expect(typeof result.current.isProfileCreating).toBe('boolean');
      expect(result.current.isProfileCreating).toBe(false);
    });
  });

  describe('successful profile creation', () => {
    it('should create profile successfully', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      const profileData = { name: 'New Profile', description: 'New Description' };

      await result.current.createProfile(profileData);

      expect(mockKy.post).toHaveBeenCalledWith('bulk-operations/profiles', {
        json: profileData,
      });
    });

    it('should show success callout on successful creation', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      await result.current.createProfile(mockProfile);

      await waitFor(() => {
        expect(mockCallout).toHaveBeenCalledWith({
          message: 'ui-bulk-edit.settings.profiles.form.create.success',
          type: 'success',
        });
      });
    });

    it('should invalidate queries on successful creation', async () => {
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      await result.current.createProfile(mockProfile);

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['test-namespace'] });
      });
    });

    it('should call onSuccess callback on successful creation', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      await result.current.createProfile(mockProfile);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should format success message correctly', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      await result.current.createProfile(mockProfile);

      await waitFor(() => {
        expect(mockFormatMessage).toHaveBeenCalledWith({
          id: 'ui-bulk-edit.settings.profiles.form.create.success'
        });
      });
    });
  });

  describe('failed profile creation', () => {
    beforeEach(() => {
      const error = new Error('API Error');
      mockKy.post.mockReturnValue({
        json: jest.fn().mockRejectedValue(error)
      });
    });

    it('should handle creation errors', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      try {
        await result.current.createProfile(mockProfile);
      } catch (error) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(mockShowErrorMessage).toHaveBeenCalled();
      });
    });

    it('should not call onSuccess on error', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      try {
        await result.current.createProfile(mockProfile);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should not show success callout on error', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      try {
        await result.current.createProfile(mockProfile);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(mockCallout).not.toHaveBeenCalled();
    });

    it('should not invalidate queries on error', async () => {
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      try {
        await result.current.createProfile(mockProfile);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show loading state during mutation', async () => {
      let resolvePromise;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockKy.post.mockReturnValue({
        json: jest.fn().mockReturnValue(pendingPromise)
      });

      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      const mutationPromise = result.current.createProfile(mockProfile);

      await waitFor(() => {
        expect(result.current.isProfileCreating).toBe(true);
      });

      resolvePromise(mockProfile);
      await mutationPromise;

      await waitFor(() => {
        expect(result.current.isProfileCreating).toBe(false);
      });
    });
  });

  describe('error message configuration', () => {
    it('should configure error messages with correct suffix', () => {
      renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      expect(useErrorMessages).toHaveBeenCalledWith({
        messageSuffix: 'ui-bulk-edit.settings.profiles.form.create.error'
      });
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ui-bulk-edit.settings.profiles.form.create.error'
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null profile data', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      await result.current.createProfile(null);

      expect(mockKy.post).toHaveBeenCalledWith('bulk-operations/profiles', {
        json: null,
      });
    });

    it('should handle empty profile data', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      await result.current.createProfile({});

      expect(mockKy.post).toHaveBeenCalledWith('bulk-operations/profiles', {
        json: {},
      });
    });
  });

  describe('multiple mutations', () => {
    it('should handle multiple consecutive mutations', async () => {
      const { result } = renderHook(() => useProfileCreate({ onSuccess: mockOnSuccess }), { wrapper });

      const profile1 = { name: 'Profile 1' };
      const profile2 = { name: 'Profile 2' };

      await result.current.createProfile(profile1);
      await result.current.createProfile(profile2);

      expect(mockKy.post).toHaveBeenCalledTimes(2);
      expect(mockOnSuccess).toHaveBeenCalledTimes(2);
      expect(mockCallout).toHaveBeenCalledTimes(2);
    });
  });
});
