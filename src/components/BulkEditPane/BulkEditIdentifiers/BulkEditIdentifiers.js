import React, { useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';
import {
  AppIcon,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';

import { APPROACHES, EDITING_STEPS, RECORD_TYPES_MAPPING } from '../../../constants';
import { useSearchParams } from '../../../hooks';
import { RootContext } from '../../../context/RootContext';
import { BulkEditListResult } from '../BulkEditListResult';
import { getBulkOperationStatsByStep } from '../BulkEditListResult/PreviewLayout/helpers';

export const BulkEditIdentifiers = ({
  children,
  bulkDetails,
  actionMenu,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const {
    step,
    approach,
    processedFileName,
    initialFileName,
    currentRecordType,
  } = useSearchParams();

  const { countOfRecords } = useContext(RootContext);
  const { isOperationInPreviewStatus } = getBulkOperationStatsByStep(bulkDetails, step);

  const isIdentifierCriteria = !bulkDetails?.fqlQuery && isOperationInPreviewStatus;

  const paneTitle = useMemo(() => {
    if ((processedFileName || initialFileName) && isIdentifierCriteria) {
      const id = approach === APPROACHES.MARC
        ? 'ui-bulk-edit.meta.title.uploadedFile.marc'
        : 'ui-bulk-edit.meta.title.uploadedFile';
      return (
        <FormattedMessage
          id={id}
          values={{ fileName: processedFileName || initialFileName }}
        />
      );
    }

    return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [processedFileName, initialFileName, isIdentifierCriteria, approach]);

  const paneSubUpdated = useMemo(() => {
    if (!isIdentifierCriteria) return null;

    return (
      <FormattedMessage
        id={`ui-bulk-edit.list.logSubTitle.${step === EDITING_STEPS.UPLOAD ? 'matched' : 'changed'}`}
        values={{ count: countOfRecords, recordType: RECORD_TYPES_MAPPING[currentRecordType] }}
      />
    );
  }, [isIdentifierCriteria, countOfRecords, step, currentRecordType]);

  const paneSub = useMemo(() => {
    return isIdentifierCriteria
      ? paneSubUpdated
      : <FormattedMessage id="ui-bulk-edit.list.logSubTitle" />;
  }, [paneSubUpdated, isIdentifierCriteria]);

  const paneProps = {
    defaultWidth: 'fill',
    paneTitle,
    paneSub,
    appIcon: <AppIcon app="bulk-edit" iconKey="app" />,
  };

  return (
    <TitleManager stripes={stripes} record={intl.formatMessage({ id: 'ui-bulk-edit.title.identifier' })}>
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

BulkEditIdentifiers.propTypes = {
  children: PropTypes.func,
  bulkDetails: PropTypes.object,
  actionMenu: PropTypes.func,
};
