import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditInApp } from '../BulkEditListResult/BulkEditInApp/BulkEditInApp';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import {
  getContentUpdatesBody,
  getMappedContentUpdates,
  isContentUpdatesFormValid
} from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import {
  QUERY_KEY_DOWNLOAD_PREVIEW_MODAL,
  useBulkOperationTenants,
  useContentUpdate,
  useHoldingsNotes,
  useHoldingsNotesEcs,
  useInstanceNotes,
  useItemNotes,
  useItemNotesEcs
} from '../../../hooks/api';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { savePreviewFile } from '../../../utils/files';
import { useSearchParams } from '../../../hooks';
import {
  CAPABILITIES,
  getHoldingsOptions,
  getInstanceOptions,
  getItemsOptions,
  getUserOptions
} from '../../../constants';
import { removeDuplicatesByValue } from '../../../utils/helpers';
import { sortAlphabetically } from '../../../utils/sortAlphabetically';


export const BulkEditInAppLayer = ({
  bulkOperationId,
  isInAppLayerOpen,
  paneProps,
  onInAppLayerClose,
}) => {
  const stripes = useStripes();
  const isCentralTenant = checkIfUserInCentralTenant(stripes);

  const { formatMessage } = useIntl();
  const { currentRecordType } = useSearchParams();

  const isItemRecordType = currentRecordType === CAPABILITIES.ITEM;
  const isHoldingsRecordType = currentRecordType === CAPABILITIES.HOLDING;
  const isInstanceRecordType = currentRecordType === CAPABILITIES.INSTANCE;

  const { data: tenants, isLoading } = useBulkOperationTenants(bulkOperationId);
  const { itemNotes, isItemNotesLoading } = useItemNotes({ enabled: isItemRecordType });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsRecordType });
  const { instanceNotes, isInstanceNotesLoading } = useInstanceNotes({ enabled: isInstanceRecordType });
  const { notesEcs: itemNotesEcs, isFetching: isItemsNotesEcsLoading } = useItemNotesEcs(tenants, 'option', { enabled: isItemRecordType && isCentralTenant && !isLoading });
  const { notesEcs: holdingsNotesEcs, isFetching: isHoldingsNotesEcsLoading } = useHoldingsNotesEcs(tenants, 'option', { enabled: isHoldingsRecordType && isCentralTenant && !isLoading });

  const options = ({
    [CAPABILITIES.ITEM]: getItemsOptions(formatMessage, removeDuplicatesByValue(isCentralTenant ? itemNotesEcs : itemNotes, tenants)),
    [CAPABILITIES.USER]: getUserOptions(formatMessage),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(formatMessage, isCentralTenant ? removeDuplicatesByValue(holdingsNotesEcs, tenants) : holdingsNotes),
    [CAPABILITIES.INSTANCE]: getInstanceOptions(formatMessage, instanceNotes),
  })[currentRecordType];

  const areAllOptionsLoaded = options && !isItemNotesLoading && !isInstanceNotesLoading && !isItemsNotesEcsLoading && !isHoldingsNotesLoading && !isHoldingsNotesEcsLoading;
  const sortedOptions = sortAlphabetically(options, formatMessage({ id:'ui-bulk-edit.options.placeholder' }));

  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const [fields, setFields] = useState([]);
  const contentUpdates = getMappedContentUpdates(fields, options);
  const isInAppFormValid = isContentUpdatesFormValid(contentUpdates);

  const {
    isPreviewModalOpened,
    isPreviewLoading,
    bulkDetails,
    totalRecords,
    downloadFile,
    confirmChanges,
    closePreviewModal,
  } = useConfirmChanges({
    queryDownloadKey: QUERY_KEY_DOWNLOAD_PREVIEW_MODAL,
    bulkOperationId,
    onDownloadSuccess: (fileData, searchParams) => {
      const { approach, initialFileName } = searchParams;

      savePreviewFile({
        bulkOperationId,
        fileData,
        approach,
        initialFileName,
      });
    },
  });

  const handleChangesCommited = () => {
    closePreviewModal();
    onInAppLayerClose();
  };

  const handleConfirm = () => {
    const contentUpdateBody = getContentUpdatesBody({
      bulkOperationId,
      contentUpdates,
      totalRecords,
    });

    confirmChanges([
      contentUpdate(contentUpdateBody)
    ]);
  };

  return (
    <>
      <BulkEditLayer
        isLayerOpen={isInAppLayerOpen}
        isConfirmDisabled={!isInAppFormValid}
        onLayerClose={onInAppLayerClose}
        onConfirm={handleConfirm}
        {...paneProps}
      >
        <BulkEditInApp
          fields={fields}
          setFields={setFields}
          options={sortedOptions}
          areAllOptionsLoaded={areAllOptionsLoaded}
        />
      </BulkEditLayer>

      <BulkEditPreviewModal
        isPreviewLoading={isPreviewLoading}
        bulkDetails={bulkDetails}
        open={isPreviewModalOpened}
        onDownload={downloadFile}
        onKeepEditing={closePreviewModal}
        onChangesCommited={handleChangesCommited}
      />
    </>
  );
};

BulkEditInAppLayer.propTypes = {
  bulkOperationId: PropTypes.string,
  isInAppLayerOpen: PropTypes.bool,
  paneProps: PropTypes.object,
  onInAppLayerClose: PropTypes.func,
};
