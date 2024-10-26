import { renderHook } from '@testing-library/react-hooks';
import { useIntl } from 'react-intl';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useErrorMessages } from './useErrorMessages';
import { ERRORS } from '../constants';

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: jest.fn(),
}));

jest.mock('../hooks/useSearchParams', () => ({
  useSearchParams: jest.fn().mockReturnValue({ initialFileName: 'initialFileName' }),
}));

describe('useErrorMessages', () => {
  const showCalloutMock = jest.fn();
  const formatMessageMock = jest.fn();

  beforeEach(() => {
    showCalloutMock.mockClear();
    formatMessageMock.mockClear();

    useIntl.mockReturnValue({
      formatMessage: formatMessageMock,
      messages: {
        'ui-bulk-edit.error.testError': 'Translated Test Error',
      },
    });

    useShowCallout.mockReturnValue(showCalloutMock);
  });

  it('should show a translated error message if one exists', () => {
    const { result } = renderHook(() => useErrorMessages());
    const { showErrorMessage } = result.current;

    formatMessageMock.mockReturnValue('Translated Test Error');

    showErrorMessage({ errorMessage: 'testError' });

    expect(showCalloutMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'testError',
    });
  });

  it('should show specific error message if error includes ERRORS.TOKEN', () => {
    const { result } = renderHook(() => useErrorMessages());
    const { showErrorMessage } = result.current;

    formatMessageMock.mockReturnValue(ERRORS.TOKEN);

    showErrorMessage({ errorMessage: 'Some message prefix + Incorrect number of tokens found in record' });

    expect(showCalloutMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Incorrect number of tokens found in record',
    });
  });

  it('should show the error message from the body if no translation is found', () => {
    const { result } = renderHook(() => useErrorMessages());
    const { showErrorMessage } = result.current;

    showErrorMessage({ errorMessage: 'nonTranslatableError' });

    expect(showCalloutMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'nonTranslatableError',
    });
    expect(formatMessageMock).not.toHaveBeenCalled();
  });

  it('should show the default error message when the response is an error object without a message', () => {
    const { result } = renderHook(() => useErrorMessages());
    const { showErrorMessage } = result.current;

    formatMessageMock.mockReturnValue('Something went wrong');

    showErrorMessage(new Error());

    expect(formatMessageMock).toHaveBeenCalledWith({ id: 'ui-bulk-edit.error.sww' });
    expect(showCalloutMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Something went wrong',
    });
  });

  it('should not show any message if no error message is provided', () => {
    const { result } = renderHook(() => useErrorMessages());
    const { showErrorMessage } = result.current;

    showErrorMessage({});

    expect(showCalloutMock).not.toHaveBeenCalled();
  });
});
