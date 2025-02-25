import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Icon, TextLink } from '@folio/stripes/components';

import { ERROR_PARAMETERS_KEYS, ERROR_TYPES } from '../constants';

import css from '../components/BulkEditPane/BulkEditListResult/PreviewLayout/Preview.css';


const getParam = (error, key) => error.parameters.find(param => param.key === key)?.value;

const renderErrorType = (error) => {
  if (!error.type || error.type === ERROR_TYPES.ERROR) {
    return <FormattedMessage id="ui-bulk-edit.list.errors.table.status.ERROR" />;
  }

  return <FormattedMessage id="ui-bulk-edit.list.errors.table.status.WARNING" />;
};

const renderErrorMessage = (error, isLinkAvailable) => {
  const link = getParam(error, ERROR_PARAMETERS_KEYS.LINK);

  return (
    <div>
      {error.message}
      {' '}
      {!!link && isLinkAvailable && (
        <span className={css.errorLink}>
          <TextLink to={link} target="_blank">
            <Icon icon="external-link" size="small" iconPosition="end">
              <FormattedMessage id="ui-bulk-edit.list.errors.table.link" />
            </Icon>
          </TextLink>
        </span>
      )}
    </div>
  );
};

export const getPreviewErrorsFormatter = ({ isLinkAvailable }) => ({
  type: renderErrorType,
  key: error => getParam(error, ERROR_PARAMETERS_KEYS.IDENTIFIER),
  message: error => renderErrorMessage(error, isLinkAvailable),
});
