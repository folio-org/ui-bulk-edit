import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes/components';
import { buildSearch, useShowCallout } from '@folio/stripes-acq-components';

import {
  APPROACHES,
  EDITING_STEPS,
  FILE_KEYS,
} from '../../../../constants';
import {
  useBulkOperationStart,
} from '../../../../hooks/api';
import { BulkEditPreviewModalFooter } from './BulkEditPreviewModalFooter';
import { useSearchParams } from '../../../../hooks';
import { BulkEditPreviewModalList } from './BulkEditPreviewModalList';


export const BulkEditPreviewModal = ({
  open,
  bulkDetails,
  isPreviewLoading,
  onKeepEditing,
  onDownload,
  onChangesCommited,
}) => {
  const callout = useShowCallout();
  const intl = useIntl();
  const history = useHistory();
  const { criteria } = useSearchParams();

  const { bulkOperationStart } = useBulkOperationStart();

  const isChangedPreviewReady = bulkDetails && Object.hasOwn(bulkDetails, FILE_KEYS.PROPOSED_CHANGES_LINK);

  const handleBulkOperationStart = async () => {
    try {
      await bulkOperationStart({
        id: bulkDetails?.id,
        approach: APPROACHES.IN_APP,
        step: EDITING_STEPS.COMMIT,
      });

      onChangesCommited();

      history.replace({
        pathname: `/bulk-edit/${bulkDetails?.id}/preview`,
        search: buildSearch({
          progress: criteria,
        }, history.location.search),
      });
    } catch {
      callout({
        type: 'error',
        message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
      });
    }
  };

  return (
    <Modal
      size="large"
      open={open}
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={
        <BulkEditPreviewModalFooter
          bulkOperationId={bulkDetails?.id}
          isActionButtonsDisabled={!isChangedPreviewReady || isPreviewLoading}
          onSave={handleBulkOperationStart}
          onDownload={onDownload}
          onKeepEditing={onKeepEditing}
        />
      }
      dismissible
      onClose={onKeepEditing}
    >
      <BulkEditPreviewModalList
        bulkDetails={bulkDetails}
        isPreviewEnabled={!isPreviewLoading}
        onPreviewError={onKeepEditing}
      />
    </Modal>
  );
};

BulkEditPreviewModal.propTypes = {
  open: PropTypes.bool,
  isPreviewLoading: PropTypes.bool,
  bulkDetails: PropTypes.object,
  onKeepEditing: PropTypes.func,
  onChangesCommited: PropTypes.func,
  onDownload: PropTypes.func,
};
