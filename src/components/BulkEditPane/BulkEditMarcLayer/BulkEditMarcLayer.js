import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditMarc } from '../BulkEditListResult/BulkEditMarc/BulkEditMarc';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { marcFieldTemplate } from '../BulkEditListResult/BulkEditMarc/helpers';
import { useMarcContentUpdate } from '../../../hooks/api/useMarcContentUpdate';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { useContentUpdate } from '../../../hooks/api';
import {
  getContentUpdatesBody,
  folioFieldTemplate,
  getMappedContentUpdates,
} from '../BulkEditListResult/BulkEditInApp/helpers';
import { sortAlphabetically } from '../../../utils/sortAlphabetically';
import { BulkEditPreviewModalFooter } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { useCommitChanges } from '../../../hooks/useCommitChanges';
import { getAdministrativeDataOptions } from '../../../constants';
import { validationSchema as marcSchema } from '../BulkEditListResult/BulkEditMarc/validation';
import { validationSchema as administrativeSchema } from '../BulkEditListResult/BulkEditInApp/validation';
import { ADMINISTRATIVE_DEFAULT_BODY, MARC_DEFAULT_BODY } from '../../../constants/forms';
import { useBulkEditForm } from '../../../hooks/useBulkEditForm';

export const BulkEditMarcLayer = ({
  bulkOperationId,
  isMarcLayerOpen,
  onMarcLayerClose,
  paneProps,
}) => {
  const { formatMessage } = useIntl();

  const { marcContentUpdate } = useMarcContentUpdate({ id: bulkOperationId });
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const { fields, setFields, isValid: isAdministrativeFormValid, isPristine: isAdministrativeFormPristine } = useBulkEditForm({
    validationSchema: administrativeSchema,
    template: folioFieldTemplate
  });

  const { fields: marcFields, setFields: setMarcFields, isValid: isMarcFormValid, isPristine: isMarcFormPristine } = useBulkEditForm({
    validationSchema: marcSchema,
    template: marcFieldTemplate
  });

  const options = sortAlphabetically(getAdministrativeDataOptions(formatMessage));

  const contentUpdates = getMappedContentUpdates(fields, options);

  const areBothFormsValid = isAdministrativeFormValid && isMarcFormValid;
  const isOnlyAdministrativeValid = isAdministrativeFormValid && isMarcFormPristine;
  const isOnlyMarcFormValid = isMarcFormValid && isAdministrativeFormPristine;

  // we can confirm the changes if either:
  // both forms are changed-and-valid
  // one is changed-and-valid and the other pristine
  const areFormsStateValid = isOnlyAdministrativeValid || isOnlyMarcFormValid || areBothFormsValid;

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

  const { commitChanges, isCommitting } = useCommitChanges({
    bulkOperationId,
    onChangesCommited: () => {
      closePreviewModal();
      onMarcLayerClose();
    }
  });

  const hasBothFiles = bulkDetails?.linkToModifiedRecordsCsvFile && bulkDetails?.linkToModifiedRecordsMarcFile;
  const areMarcAndCsvReady = hasBothFiles && isPreviewSettled;

  const handleConfirm = () => {
    const bulkOperationMarcRules = marcFields.map((item) => ({
      bulkOperationId,
      ...item
    }));

    const marcUpdateBody = isMarcFormValid ? {
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
        isConfirmDisabled={!areFormsStateValid}
        onLayerClose={onMarcLayerClose}
        onConfirm={handleConfirm}
        {...paneProps}
      >
        <BulkEditMarc
          fields={fields}
          setFields={setFields}
          marcFields={marcFields}
          setMarcFields={setMarcFields}
          options={options}
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
            buttonsDisabled={!areMarcAndCsvReady || isCommitting}
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
  paneProps: PropTypes.shape({}),
  isMarcLayerOpen: PropTypes.bool,
  onMarcLayerClose: PropTypes.func,
};
