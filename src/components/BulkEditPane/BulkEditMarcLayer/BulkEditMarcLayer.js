import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useIntl } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditMarc } from '../BulkEditListResult/BulkEditMarc/BulkEditMarc';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { getMarcFieldTemplate, getTransformedField } from '../BulkEditListResult/BulkEditMarc/helpers';
import { useMarcContentUpdate } from '../../../hooks/api/useMarcContentUpdate';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { QUERY_KEY_DOWNLOAD_MARC_PREVIEW_MODAL, useContentUpdate } from '../../../hooks/api';
import { savePreviewFile } from '../../../utils/files';
import {
  getContentUpdatesBody, getMappedContentUpdates,
  isContentUpdatesFormValid
} from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { getMarcFormErrors } from '../BulkEditListResult/BulkEditMarc/validation';
import { getAdministrativeDataOptions } from '../../../constants';
import { sortAlphabetically } from '../../../utils/sortAlphabetically';

export const BulkEditMarcLayer = ({
  bulkOperationId,
  isMarcLayerOpen,
  onMarcLayerClose,
  paneProps,
}) => {
  const { formatMessage } = useIntl();
  const options = getAdministrativeDataOptions(formatMessage);
  const sortedOptions = sortAlphabetically(options, formatMessage({ id:'ui-bulk-edit.options.placeholder' }));

  const [fields, setFields] = useState([]);
  const [marcFields, setMarcFields] = useState([getMarcFieldTemplate(uniqueId())]);

  const marcFormErrors = getMarcFormErrors(marcFields);
  const contentUpdates = getMappedContentUpdates(fields, options);

  const isMarcFieldsValid = Object.keys(marcFormErrors).length === 0;
  const isAdministrativeFormValid = isContentUpdatesFormValid(contentUpdates);
  const isAnyFormValid = isMarcFieldsValid || isAdministrativeFormValid;

  const { marcContentUpdate } = useMarcContentUpdate({ id: bulkOperationId });
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const {
    isPreviewModalOpened,
    isPreviewLoading,
    bulkDetails,
    totalRecords,
    downloadFile,
    confirmChanges,
    closePreviewModal,
  } = useConfirmChanges({
    queryDownloadKey: QUERY_KEY_DOWNLOAD_MARC_PREVIEW_MODAL,
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
    onMarcLayerClose();
  };

  const handleConfirm = () => {
    const bulkOperationMarcRules = marcFields
      .map(field => ({
        bulkOperationId,
        ...getTransformedField(field),
      }));

    const marcUpdateBody = {
      bulkOperationMarcRules,
      totalRecords,
    };

    const administrativeBody = getContentUpdatesBody({
      bulkOperationId,
      contentUpdates,
      totalRecords,
    });

    // send updates only for valid forms
    confirmChanges([
      ...(isMarcFieldsValid ? [marcContentUpdate(marcUpdateBody)] : []),
      ...(isAdministrativeFormValid ? [contentUpdate(administrativeBody)] : []),
    ]);
  };

  return (
    <>
      <BulkEditLayer
        isLayerOpen={isMarcLayerOpen}
        isConfirmDisabled={!isAnyFormValid}
        onLayerClose={onMarcLayerClose}
        onConfirm={handleConfirm}
        {...paneProps}
      >
        <BulkEditMarc
          fields={fields}
          setFields={setFields}
          marcFields={marcFields}
          setMarcFields={setMarcFields}
          options={sortedOptions}
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

BulkEditMarcLayer.propTypes = {
  bulkOperationId: PropTypes.string,
  paneProps: PropTypes.object,
  isMarcLayerOpen: PropTypes.bool,
  onMarcLayerClose: PropTypes.func,
};
