import React, { useContext, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Pane } from '@folio/stripes/components';
import { noop } from 'lodash/util';
import { AppIcon } from '@folio/stripes/core';
import { APPROACHES, EDITING_STEPS } from '../../../constants';
import { useBulkPermissions } from '../../../hooks';
import { useSearchParams } from '../../../hooks/useSearchParams';
import { RootContext } from '../../../context/RootContext';
import { BulkEditListResult } from '../BulkEditListResult';
import { BulkEditActionMenu } from '../../BulkEditActionMenu';

export const BulkEditIdentifiers = ({ bulkDetails, renderApproach }) => {
  const { isActionMenuShown } = useBulkPermissions();

  const {
    step,
    processedFileName,
    initialFileName,
  } = useSearchParams();

  const {
    visibleColumns,
    countOfRecords,
    setIsBulkEditLayerOpen,
    setIsBulkEditModalOpen,
  } = useContext(RootContext);

  const isIdentifierTabWithPreview = visibleColumns?.length && !bulkDetails?.fqlQuery;

  const handleStartBulkEdit = (approach) => {
    if (approach === APPROACHES.IN_APP) {
      setIsBulkEditLayerOpen(true);
    }

    if (approach === APPROACHES.MANUAL) {
      setIsBulkEditModalOpen(true);
    }
  };

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

  const actionMenu = () => isActionMenuShown && (
    <BulkEditActionMenu
      onEdit={handleStartBulkEdit}
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

BulkEditIdentifiers.propTypes = {
  bulkDetails: PropTypes.object,
  renderApproach: PropTypes.func,
};
