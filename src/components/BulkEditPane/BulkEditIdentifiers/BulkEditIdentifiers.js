import React, { useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';
import {
  AppIcon,
  TitleManager, useStripes
} from '@folio/stripes/core';

import { EDITING_STEPS } from '../../../constants';
import { useSearchParams } from '../../../hooks/useSearchParams';
import { RootContext } from '../../../context/RootContext';
import { BulkEditListResult } from '../BulkEditListResult';

export const BulkEditIdentifiers = ({
  bulkDetails,
  actionMenu,
  renderInAppApproach,
  renderManualApproach
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const {
    step,
    processedFileName,
    initialFileName,
  } = useSearchParams();

  const {
    visibleColumns,
    countOfRecords,
  } = useContext(RootContext);

  const isIdentifierTabWithPreview = visibleColumns?.length && !bulkDetails?.fqlQuery;

  const paneTitle = useMemo(() => {
    if ((processedFileName || initialFileName) && isIdentifierTabWithPreview) {
      return (
        <FormattedMessage
          id="ui-bulk-edit.meta.title.uploadedFile"
          values={{ fileName: processedFileName || initialFileName }}
        />
      );
    }

    return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [processedFileName, initialFileName, isIdentifierTabWithPreview]);

  const paneSubUpdated = useMemo(() => {
    if (!isIdentifierTabWithPreview) return null;

    return (
      <FormattedMessage
        id={`ui-bulk-edit.list.logSubTitle.${step === EDITING_STEPS.UPLOAD ? 'matched' : 'changed'}`}
        values={{ count: countOfRecords }}
      />
    );
  }, [isIdentifierTabWithPreview, countOfRecords, step]);

  const paneSub = useMemo(() => {
    return (step === EDITING_STEPS.UPLOAD || step === EDITING_STEPS.COMMIT) && isIdentifierTabWithPreview
      ? paneSubUpdated
      : <FormattedMessage id="ui-bulk-edit.list.logSubTitle" />;
  }, [step, paneSubUpdated, isIdentifierTabWithPreview]);

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

        {renderInAppApproach(paneProps)}
        {renderManualApproach()}
      </Pane>
    </TitleManager>
  );
};

BulkEditIdentifiers.propTypes = {
  bulkDetails: PropTypes.object,
  actionMenu: PropTypes.func,
  renderInAppApproach: PropTypes.func,
  renderManualApproach: PropTypes.func,
};
