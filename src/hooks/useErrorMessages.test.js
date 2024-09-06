import { useIntl } from 'react-intl';
import { renderHook } from '@testing-library/react-hooks';

import { useShowCallout } from '@folio/stripes-acq-components';

import { useErrorMessages } from './useErrorMessages';

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: jest.fn(),
}));

describe('useErrorMessages', () => {
  const mockCallout = jest.fn();
  const mockFormatMessage = jest.fn();

  beforeEach(() => {
    useIntl.mockReturnValue({ formatMessage: mockFormatMessage });
    useShowCallout.mockReturnValue(mockCallout);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the callout with the correct error message when errorMessage exists', () => {
    const data = { errorMessage: 'some-error' };

    const { result } = renderHook(() => useErrorMessages());

    result.current.checkErrorMessage(data);

    expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ui-bulk-edit.some-error' });
  });

  it('should not call the callout when errorMessage does not exist', () => {
    const data = {};

    const { result } = renderHook(() => useErrorMessages());

    result.current.checkErrorMessage(data);

    expect(mockCallout).not.toHaveBeenCalled();
    expect(mockFormatMessage).not.toHaveBeenCalled();
  });

  it('should not call the callout when data is null or undefined', () => {
    const { result } = renderHook(() => useErrorMessages());

    result.current.checkErrorMessage(null);
    result.current.checkErrorMessage(undefined);

    expect(mockCallout).not.toHaveBeenCalled();
    expect(mockFormatMessage).not.toHaveBeenCalled();
  });
});
