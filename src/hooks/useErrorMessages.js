import { useIntl } from 'react-intl';
import { useShowCallout } from '@folio/stripes-acq-components';

import { ERRORS } from '../constants';
import { useSearchParams } from './useSearchParams';


export const useErrorMessages = () => {
  const intl = useIntl();
  const callout = useShowCallout();
  const { initialFileName } = useSearchParams();

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

  return {
    showErrorMessage,
  };
};
