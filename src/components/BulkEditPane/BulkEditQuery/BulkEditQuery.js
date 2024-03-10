import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

import { BulkEditListResult } from '../BulkEditListResult';
import { EDITING_STEPS } from '../../../constants';
import { useSearchParams } from '../../../hooks/useSearchParams';
import { RootContext } from '../../../context/RootContext';

export const BulkEditQuery = ({ bulkDetails, actionMenu, renderInAppApproach, renderManualApproach }) => {
  const {
    step,
  } = useSearchParams();

  const {
    visibleColumns,
    countOfRecords,
  } = useContext(RootContext);

  const isQueryTabWithPreview = visibleColumns?.length && bulkDetails?.fqlQuery;

  const paneTitle = useMemo(() => {
    if (isQueryTabWithPreview) {
      return <FormattedMessage id="ui-bulk-edit.meta.query.title" />;
    }

    return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [isQueryTabWithPreview]);

  const paneSubtitleUpdated = useMemo(() => {
    if (!isQueryTabWithPreview) return null;

    return (
      <FormattedMessage
        id={`ui-bulk-edit.list.logSubTitle.${step === EDITING_STEPS.UPLOAD ? 'matched' : 'changed'}`}
        values={{ count: countOfRecords }}
      />
    );
  }, [isQueryTabWithPreview, countOfRecords, step]);

  const paneSub = useMemo(() => {
    return (
      (step === EDITING_STEPS.UPLOAD || step === EDITING_STEPS.COMMIT) && isQueryTabWithPreview
        ? paneSubtitleUpdated
        : <FormattedMessage id="ui-bulk-edit.list.logSubTitle" />
    );
  }, [isQueryTabWithPreview, step, paneSubtitleUpdated]);

  const paneProps = {
    defaultWidth: 'fill',
    paneTitle,
    paneSub,
    appIcon: <AppIcon app="bulk-edit" iconKey="app" />,
  };

  return (
    <Pane
      actionMenu={actionMenu}
      {...paneProps}
    >
      <BulkEditListResult />

      {renderInAppApproach(paneProps)}
      {renderManualApproach()}
    </Pane>
  );
};

BulkEditQuery.propTypes = {
  bulkDetails: PropTypes.object,
  actionMenu: PropTypes.object,
  renderInAppApproach: PropTypes.func,
  renderManualApproach: PropTypes.func,
};
