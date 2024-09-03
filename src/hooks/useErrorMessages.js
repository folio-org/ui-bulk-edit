import { useIntl } from 'react-intl';
import { useShowCallout } from '@folio/stripes-acq-components';

export const useErrorMessages = () => {
  const intl = useIntl();
  const callout = useShowCallout();

  const showErrorMessage = (data) => {
    const message = data?.errorMessage;

    if (message) {
      callout({
        type: 'error',
        message: intl.formatMessage({ id: `ui-bulk-edit.${message}` }),
      });
    }
  };

  return {
    showErrorMessage,
  };
};
