import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  AppIcon,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

import { BulkEditListResult } from '../BulkEditListResult';
import { APPROACHES, EDITING_STEPS, RECORD_TYPES_MAPPING } from '../../../constants';
import { useSearchParams } from '../../../hooks';
import { RootContext } from '../../../context/RootContext';
import { getBulkOperationStatsByStep } from '../BulkEditListResult/PreviewLayout/helpers';

export const BulkEditQuery = ({ children, bulkDetails, actionMenu }) => {
  const {
    step,
    approach,
    currentRecordType
  } = useSearchParams();
  const intl = useIntl();

  const { countOfRecords } = useContext(RootContext);
  const stripes = useStripes();

  const { hasAnyFilesToDownload } = getBulkOperationStatsByStep(bulkDetails, step);
  const isQueryCriteria = bulkDetails?.fqlQuery && hasAnyFilesToDownload;

  const paneTitle = useMemo(() => {
    if (isQueryCriteria) {
      const id = approach === APPROACHES.MARC
        ? 'ui-bulk-edit.meta.query.title.marc'
        : 'ui-bulk-edit.meta.query.title';

      return <FormattedMessage id={id} />;
    }

    return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [isQueryCriteria, approach]);

  const paneSubtitleUpdated = useMemo(() => {
    if (!isQueryCriteria) return null;

    return (
      <FormattedMessage
        id={`ui-bulk-edit.list.logSubTitle.${step === EDITING_STEPS.UPLOAD ? 'matched' : 'changed'}`}
        values={{ count: countOfRecords, recordType: RECORD_TYPES_MAPPING[currentRecordType] }}
      />
    );
  }, [isQueryCriteria, countOfRecords, step, currentRecordType]);

  const paneSub = useMemo(() => {
    return hasAnyFilesToDownload && isQueryCriteria
      ? paneSubtitleUpdated
      : <FormattedMessage id="ui-bulk-edit.list.logSubTitle" />;
  }, [hasAnyFilesToDownload, paneSubtitleUpdated, isQueryCriteria]);

  const paneProps = {
    defaultWidth: 'fill',
    paneTitle,
    paneSub,
    appIcon: <AppIcon app="bulk-edit" iconKey="app" />,
  };

  return (
    <TitleManager stripes={stripes} record={intl.formatMessage({ id: 'ui-bulk-edit.title.query' })}>
      <Pane
        actionMenu={actionMenu}
        {...paneProps}
      >
        <BulkEditListResult />

        {children(paneProps)}
      </Pane>
    </TitleManager>
  );
};

BulkEditQuery.propTypes = {
  children: PropTypes.func.isRequired,
  bulkDetails: PropTypes.object,
  actionMenu: PropTypes.object,
};
