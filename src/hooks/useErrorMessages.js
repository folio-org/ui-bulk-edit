import { useIntl } from 'react-intl';
import { getReasonPhrase } from 'http-status-codes';

import { useShowCallout } from '@folio/stripes-acq-components';
import { useModuleInfo } from '@folio/stripes/core';

import { ERRORS } from '../constants';
import { useSearchParams } from './useSearchParams';

/**
 * Custom hook for handling and displaying error messages.
 *
 * @param {Object} params - Hook parameters. Default is empty object.
 * @param {string} params.path - The API path to fetch relevant information about backend module.
 * @returns {Object} - Functions for error handling.
 */
export const useErrorMessages = ({ path = '' } = {}) => {
  const intl = useIntl();
  const callout = useShowCallout();
  const { initialFileName } = useSearchParams();
  const module = useModuleInfo(path);

  const showError = (message) => {
    callout({
      type: 'error',
      message,
    });
  };

  const showErrorMessage = (res, meta) => {
    const message = res?.errorMessage;

    // check if error message should be translated (if it's exist in translations)
    const prefixedMessageId = `ui-bulk-edit.${message}`;
    const translatedMessage = intl.messages[prefixedMessageId] ? intl.formatMessage({ id: prefixedMessageId }) : '';

    // show translated message if it exists
    if (translatedMessage) {
      showError(translatedMessage);
      // otherwise show an error message we have
    } else if (message) {
      // if error message contains token error, show a special message
      if (message?.includes(ERRORS.TOKEN)) {
        showError(intl.formatMessage({ id: 'ui-bulk-edit.error.incorrectFormatted' }, { fileName: meta?.fileName || initialFileName }));
      } else {
        showError(message);
      }
      // if there is no error message but it's error instance, show sww error message
    } else if (res instanceof Error) {
      showError(intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }));
    }
  };

  const showExternalModuleError = (error) => {
    const status = error?.response?.status ?? 500;
    const initialErrorMessage = error?.message;

    let displayMessage = '';

    try {
      displayMessage = getReasonPhrase(initialErrorMessage); // Some modules return the error message as a known status
    } catch {
      const statusErrorMessage = getReasonPhrase(status);

      // Determine displayMessage details based on priority: initialErrorMessage > statusErrorMessage
      displayMessage = initialErrorMessage || statusErrorMessage;
    }

    showError(`${module?.name} returns status code: ${status} - ${displayMessage}.`);
  };

  return {
    showErrorMessage,
    showExternalModuleError,
  };
};
