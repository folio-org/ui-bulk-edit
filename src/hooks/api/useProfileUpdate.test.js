import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react-hooks';
import { useProfileUpdate } from './useProfileUpdate';
import { BULK_EDIT_PROFILES_API } from '../../constants';

const mockPut = jest.fn();
const mockKy = { put: mockPut };
const mockCallout = jest.fn();
const mockInvalidate = jest.fn();
const mockOnSuccess = jest.fn();
const mockShowErrorMessage = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: () => mockKy,
  useNamespace: () => ['myNamespace'],
}));

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: () => mockCallout,
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }) => `msg:${id}`,
  }),
}));

jest.mock('../useErrorMessages', () => ({
  useErrorMessages: () => ({
    showErrorMessage: mockShowErrorMessage,
  }),
}));

jest.mock('react-query', () => {
  const original = jest.requireActual('react-query');
  return {
    ...original,
    useQueryClient: () => ({
      invalidateQueries: mockInvalidate,
    }),
  };
});

const createWrapper = () => {
  const client = new QueryClient();
  return ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe('useProfileUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('on success: calls ky.put, shows success callout, invalidates namespace query, and calls onSuccess', async () => {
    mockPut.mockReturnValueOnce({
      json: () => Promise.resolve({ updated: true }),
    });

    const { result } = renderHook(
      () => useProfileUpdate({ id: '123', onSuccess: mockOnSuccess }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      const data = { foo: 'bar' };
      await result.current.updateProfile(data);
    });

    expect(mockPut).toHaveBeenCalledWith(
      `${BULK_EDIT_PROFILES_API}/123`,
      { json: { foo: 'bar' } }
    );

    expect(mockCallout).toHaveBeenCalledWith({
      message: 'msg:ui-bulk-edit.settings.profiles.form.update.success',
      type: 'success',
    });

    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['myNamespace'] });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('on error: calls showErrorMessage with the thrown error and the variables', async () => {
    const testError = new Error('network fail');
    mockPut.mockReturnValueOnce({
      json: () => Promise.reject(testError),
    });

    const { result } = renderHook(
      () => useProfileUpdate({ id: '999', onSuccess: mockOnSuccess }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await expect(result.current.updateProfile({ a: 1 })).rejects.toThrow('network fail');
    });

    expect(mockShowErrorMessage).toHaveBeenCalledTimes(1);

    expect(mockShowErrorMessage).toHaveBeenCalledWith(
      testError,
      { a: 1 },
      undefined
    );

    expect(mockCallout).not.toHaveBeenCalled();
    expect(mockInvalidate).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('exposes isProfileUpdating flag correctly', async () => {
    let resolveJson;
    const pending = new Promise(res => { resolveJson = res; });
    mockPut.mockReturnValueOnce({ json: () => pending });

    const { result, waitForNextUpdate } = renderHook(
      () => useProfileUpdate({ id: 'X', onSuccess: jest.fn() }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.updateProfile({}).catch(() => {});
    });

    await waitForNextUpdate();
    expect(result.current.isProfileUpdating).toBe(true);

    act(() => {
      resolveJson({ done: true });
    });

    await waitForNextUpdate();
    expect(result.current.isProfileUpdating).toBe(false);
  });
});
