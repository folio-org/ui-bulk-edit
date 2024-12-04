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
import { APPROACHES, EDITING_STEPS } from '../../../constants';
import { useSearchParams } from '../../../hooks';
import { RootContext } from '../../../context/RootContext';

export const BulkEditQuery = ({ children, bulkDetails, actionMenu }) => {
  const {
    step,
    approach,
  } = useSearchParams();
  const intl = useIntl();

  const {
    visibleColumns,
    countOfRecords,
  } = useContext(RootContext);
  const stripes = useStripes();

  const isQueryTabWithPreview = visibleColumns?.length && bulkDetails?.fqlQuery;

  const paneTitle = useMemo(() => {
    if (isQueryTabWithPreview) {
      const id = approach === APPROACHES.MARC
        ? 'ui-bulk-edit.meta.query.title.marc'
        : 'ui-bulk-edit.meta.query.title';

      return <FormattedMessage id={id} />;
    }

    return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [isQueryTabWithPreview, approach]);

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
