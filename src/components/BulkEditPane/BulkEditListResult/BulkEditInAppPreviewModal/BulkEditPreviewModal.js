import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes/components';
import { buildSearch } from '@folio/stripes-acq-components';

import { Preloader } from '@folio/stripes-data-transfer-components';
import {
  APPROACHES,
  EDITING_STEPS,
  FILE_KEYS,
  JOB_STATUSES,
} from '../../../../constants';
import { BULK_OPERATION_DETAILS_KEY, useBulkOperationStart } from '../../../../hooks/api';
import { BulkEditPreviewModalFooter } from './BulkEditPreviewModalFooter';
import { useSearchParams } from '../../../../hooks';
import { BulkEditPreviewModalList } from './BulkEditPreviewModalList';
import { useErrorMessages } from '../../../../hooks/useErrorMessages';


export const BulkEditPreviewModal = ({
  open,
  bulkDetails,
  isPreviewLoading,
  onKeepEditing,
  onDownload,
  onChangesCommited,
}) => {
  const history = useHistory();
  const { criteria, approach } = useSearchParams();
  const { showErrorMessage } = useErrorMessages();
  const { bulkOperationStart } = useBulkOperationStart();
  const queryClient = useQueryClient();

  const hasLinkForDownload = bulkDetails?.[FILE_KEYS.PROPOSED_CHANGES_LINK_MARC] || bulkDetails?.[FILE_KEYS.PROPOSED_CHANGES_LINK];

  const downloadLabel = approach === APPROACHES.MARC
    ? <FormattedMessage id="ui-bulk-edit.previewModal.downloadPreview.marc" />
    : <FormattedMessage id="ui-bulk-edit.previewModal.downloadPreview" />;

  const handleBulkOperationStart = async () => {
    try {
      await bulkOperationStart({
        id: bulkDetails?.id,
        approach: APPROACHES.IN_APP,
        step: EDITING_STEPS.COMMIT,
      });

      queryClient.resetQueries(BULK_OPERATION_DETAILS_KEY);

      onChangesCommited();

      history.replace({
        pathname: `/bulk-edit/${bulkDetails?.id}/preview`,
        search: buildSearch({
          progress: criteria,
        }, history.location.search),
      });
    } catch (e) {
      showErrorMessage(e);
    }
  };

  const isModalButtonDisabled = !hasLinkForDownload || isPreviewLoading || bulkDetails?.status !== JOB_STATUSES.REVIEW_CHANGES;

  return (
    <Modal
      size="large"
      open={open}
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={
        <BulkEditPreviewModalFooter
          downloadLabel={downloadLabel}
          bulkOperationId={bulkDetails?.id}
          isCommitBtnDisabled={isModalButtonDisabled}
          isDownloadBtnDisabled={isModalButtonDisabled}
          onSave={handleBulkOperationStart}
          onDownload={onDownload}
          onKeepEditing={onKeepEditing}
        />
      }
      dismissible
      onClose={onKeepEditing}
    >
      {isPreviewLoading ?
        <Preloader />
        :
        <BulkEditPreviewModalList
          onPreviewError={onKeepEditing}
        />
      }
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
