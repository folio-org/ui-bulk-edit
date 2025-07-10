import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';import { useIntl } from 'react-intl';
import { getReasonPhrase } from 'http-status-codes';

import { useShowCallout } from '@folio/stripes-acq-components';

import { useErrorMessages } from './useErrorMessages';
import { ERRORS } from '../constants';


jest.mock('@folio/stripes/core', () => ({
  useModuleInfo: jest.fn().mockReturnValue({ name: 'TestModule' }),
}));

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

  it('should use variables from meta object if provided', () => {
    const { result } = renderHook(() => useErrorMessages());
    const { showErrorMessage } = result.current;

    formatMessageMock.mockImplementationOnce(({ id }, { fileName }) => {
      return `${id}.${fileName}`;
    });

    showErrorMessage({ errorMessage: ERRORS.TOKEN }, { fileName: 'testFileName' });

    expect(formatMessageMock).toHaveBeenCalledWith({ id: 'ui-bulk-edit.error.incorrectFormatted' }, { fileName: 'testFileName' });
    expect(showCalloutMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'ui-bulk-edit.error.incorrectFormatted.testFileName',
    });
  });

  describe('showExternalModuleError', () => {
    it('should show an error message using the status code if message not provided', () => {
      const { result } = renderHook(() => useErrorMessages());

      result.current.showExternalModuleError({ response: { status: 404 } });

      expect(showCalloutMock)
        .toHaveBeenCalledWith({
          type: 'error',
          message: `TestModule returns status code: 404 - ${getReasonPhrase(404)}.`,
        });
    });

    it('should show an error message using the "message" property if it exists', () => {
      const { result } = renderHook(() => useErrorMessages());

      const errorMessage = 'Something went wrong';
      result.current.showExternalModuleError({ message: errorMessage });

      expect(showCalloutMock)
        .toHaveBeenCalledWith({
          type: 'error',
          message: `TestModule returns status code: 500 - ${errorMessage}.`,
        });
    });

    it('should show an error message using the message if message corresponds to a known status string', () => {
      const { result } = renderHook(() => useErrorMessages());

      const errorMessage = 'Not Found';
      result.current.showExternalModuleError({
        response: { status: 403 },
        message: errorMessage
      });

      expect(showCalloutMock)
        .toHaveBeenCalledWith({
          type: 'error',
          message: 'TestModule returns status code: 403 - Not Found.',
        });
    });

    it('should show a generic status error message if neither a valid message nor a recognized message key is provided', () => {
      const { result } = renderHook(() => useErrorMessages());

      result.current.showExternalModuleError({ response: { status: 418 } });

      expect(showCalloutMock)
        .toHaveBeenCalledWith({
          type: 'error',
          message: `TestModule returns status code: 418 - ${getReasonPhrase(418)}.`,
        });
    });

    it('should default to 500 if no status is provided and message is empty', () => {
      const { result } = renderHook(() => useErrorMessages());

      result.current.showExternalModuleError({ response: undefined });

      expect(showCalloutMock)
        .toHaveBeenCalledWith({
          type: 'error',
          message: `TestModule returns status code: 500 - ${getReasonPhrase(500)}.`,
        });
    });

    it('should handle a scenario where the module returns a non-standard error message', () => {
      const { result } = renderHook(() => useErrorMessages());

      const nonStandardMessage = 'Custom module error occurred';
      result.current.showExternalModuleError({
        response: { status: 501 },
        message: nonStandardMessage
      });

      expect(showCalloutMock)
        .toHaveBeenCalledWith({
          type: 'error',
          message: `TestModule returns status code: 501 - ${nonStandardMessage}.`,
        });
    });
  });
});
