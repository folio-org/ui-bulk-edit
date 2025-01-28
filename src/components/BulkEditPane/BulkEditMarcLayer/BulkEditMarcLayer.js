import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditMarc } from '../BulkEditListResult/BulkEditMarc/BulkEditMarc';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { getMarcFieldTemplate } from '../BulkEditListResult/BulkEditMarc/helpers';
import { useMarcContentUpdate } from '../../../hooks/api/useMarcContentUpdate';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { useContentUpdate } from '../../../hooks/api';
import { getContentUpdatesBody } from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { sortAlphabetically } from '../../../utils/sortAlphabetically';
import { BulkEditPreviewModalFooter } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { useCommitChanges } from '../../../hooks/useCommitChanges';
import { useMarcApproachValidation } from '../../../hooks/useMarcApproachValidation';


const MARC_DEFAULT_BODY = {
  bulkOperationMarcRules: [],
  totalRecords: 0,
};

const ADMINISTRATIVE_DEFAULT_BODY = {
  bulkOperationRules: [],
  totalRecords: 0,
};

export const BulkEditMarcLayer = ({
  bulkOperationId,
  isMarcLayerOpen,
  onMarcLayerClose,
  paneProps,
}) => {
  const [fields, setFields] = useState([]);
  const [marcFields, setMarcFields] = useState([getMarcFieldTemplate(uniqueId())]);

  const { marcContentUpdate } = useMarcContentUpdate({ id: bulkOperationId });
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const {
    options,
    isMarcFieldsValid,
    isMarcFormPristine,
    isAdministrativeFormValid,
    isAdministrativeFormPristine,
    contentUpdates,
    marcContentUpdates,
  } = useMarcApproachValidation({ fields, marcFields });

  const sortedOptions = sortAlphabetically(options);

  const {
    isPreviewModalOpened,
    isJobPreparing,
    isPreviewSettled,
    bulkDetails,
    totalRecords,
    confirmChanges,
    closePreviewModal,
    changePreviewSettled,
  } = useConfirmChanges({ bulkOperationId });

  const { commitChanges } = useCommitChanges({
    bulkOperationId,
    onChangesCommited: () => {
      closePreviewModal();
      onMarcLayerClose();
    }
  });

  const hasBothFiles = bulkDetails?.linkToModifiedRecordsCsvFile && bulkDetails?.linkToModifiedRecordsMarcFile;
  const areMarcAndCsvReady = hasBothFiles && isPreviewSettled;

  const areAllFormsValid = (isAdministrativeFormValid && !isMarcFormPristine)
    || (isMarcFieldsValid && !isAdministrativeFormPristine);

  const handleConfirm = () => {
    const bulkOperationMarcRules = marcContentUpdates.map((item) => ({
      bulkOperationId,
      ...item
    }));

    const marcUpdateBody = isMarcFieldsValid ? {
      bulkOperationMarcRules,
      totalRecords,
    } : MARC_DEFAULT_BODY;

    const administrativeBody = isAdministrativeFormValid ? getContentUpdatesBody({
      bulkOperationId,
      contentUpdates,
      totalRecords,
    }) : ADMINISTRATIVE_DEFAULT_BODY;

    const updateSequence = () => contentUpdate(administrativeBody)
      .then(() => marcContentUpdate(marcUpdateBody));

    confirmChanges(updateSequence);
  };

  return (
    <>
      <BulkEditLayer
        isLayerOpen={isMarcLayerOpen}
        isConfirmDisabled={!areAllFormsValid}
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
        isJobPreparing={isJobPreparing}
        isPreviewSettled={isPreviewSettled}
        onKeepEditing={closePreviewModal}
        open={isPreviewModalOpened}
        onPreviewSettled={changePreviewSettled}
        modalFooter={
          <BulkEditPreviewModalFooter
            bulkDetails={bulkDetails}
            buttonsDisabled={!areMarcAndCsvReady}
            onCommitChanges={commitChanges}
            onKeepEditing={closePreviewModal}
          />
        }
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
