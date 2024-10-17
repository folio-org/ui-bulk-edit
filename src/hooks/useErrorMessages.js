import { useIntl } from 'react-intl';
import { useShowCallout } from '@folio/stripes-acq-components';


export const useErrorMessages = () => {
  const intl = useIntl();
  const callout = useShowCallout();

  const showError = (message) => {
    callout({
      type: 'error',
      message,
    });
  };

  const showErrorMessage = (res) => {
    const messageInBody = res?.errorMessage;
    const messageWhenError = res?.message;
    const message = messageInBody || messageWhenError;

    // check if error message should be translated (if it's exist in translations)
    const translatedMessage = intl.messages[message] ? intl.formatMessage({ id: `ui-bulk-edit.${message}` }) : '';

    // show translated message if it exists
    if (translatedMessage) {
      showError(translatedMessage);
      // otherwise show an error message we have
    } else if (message) {
      showError(message);
      // if there is no error message but it's error instance, show sww error message
    } else if (res instanceof Error) {
      showError(intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }));
    }
  };

  return {
    showErrorMessage,
  };
};
