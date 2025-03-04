import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { Icon, NoValue, TextLink } from '@folio/stripes/components';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import BulkEditLogsActions from '../components/BulkEditLogs/BulkEditLogsActions/BulkEditLogsActions';
import { ERROR_PARAMETERS_KEYS, ERROR_TYPES, LINK_KEYS } from '../constants';

import css from '../components/BulkEditPane/BulkEditListResult/PreviewLayout/Preview.css';

/* Logs Preview */

const isActionsRendered = (item) => Object.keys(item).some(key => Object.keys(LINK_KEYS).includes(key));

export const getLogsResultsFormatter = () => ({
  id: item => item.id,
  operationType: item => item.operationType,
  entityType: item => <FormattedMessage id={`ui-bulk-edit.logs.entityType.${item.entityType}`} />,
  status: item => <FormattedMessage id={`ui-bulk-edit.logs.status.${item.status}`} />,
  userId: item => item.runBy,
  startTime: item => <FolioFormattedTime dateString={item.startTime} />,
  endTime: item => <FolioFormattedTime dateString={item.endTime} />,
  totalNumOfRecords: item => <FormattedNumber value={item.totalNumOfRecords} />,
  processedNumOfRecords: item => <FormattedNumber value={item.processedNumOfRecords} />,
  approach: item => (
    item.approach
      ? <FormattedMessage id={`ui-bulk-edit.logs.approach.${item.approach}`} />
      : <NoValue />
  ),
  actions: (item) => isActionsRendered(item) && <BulkEditLogsActions item={item} />,
});

/* Errors Preview */

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

export const getPreviewErrorsResultFormatter = ({ isLinkAvailable }) => ({
  type: renderErrorType,
  key: error => getParam(error, ERROR_PARAMETERS_KEYS.IDENTIFIER),
  message: error => renderErrorMessage(error, isLinkAvailable),
});
