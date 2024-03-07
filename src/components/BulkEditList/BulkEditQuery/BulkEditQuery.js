import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';
import { noop } from 'lodash/util';

import { BulkEditListResult } from '../BulkEditListResult';
import { EDITING_STEPS } from '../../../constants';
import { useBulkPermissions } from '../../../hooks';
import { useSearchParams } from '../../../hooks/useSearchParams';
import { BulkEditActionMenu } from '../../BulkEditActionMenu';
import { RootContext } from '../../../context/RootContext';

export const BulkEditQuery = ({ bulkDetails, renderApproach }) => {
  const { isActionMenuShown } = useBulkPermissions();
  const {
    step,
  } = useSearchParams();

  const {
    visibleColumns,
    countOfRecords,
    setIsBulkEditLayerOpen,
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

  const actionMenu = () => isQueryTabWithPreview && isActionMenuShown && (
    <BulkEditActionMenu
      onEdit={() => setIsBulkEditLayerOpen(true)}
      onToggle={noop}
    />
  );

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

      {renderApproach(paneProps)}
    </Pane>
  );
};

BulkEditQuery.propTypes = {
  bulkDetails: PropTypes.object,
  renderApproach: PropTypes.func,
};
