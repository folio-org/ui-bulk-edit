import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import { omit, isEqual } from 'lodash';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditMarc } from '../BulkEditListResult/BulkEditMarc/BulkEditMarc';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { getMarcFieldTemplate, getTransformedField } from '../BulkEditListResult/BulkEditMarc/helpers';
import { useMarcContentUpdate } from '../../../hooks/api/useMarcContentUpdate';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { useContentUpdate } from '../../../hooks/api';
import {
  getContentUpdatesBody,
  getMappedContentUpdates,
  isContentUpdatesFormValid,
  isMarcContentUpdatesFormValid
} from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { sortAlphabetically } from '../../../utils/sortAlphabetically';
import { BulkEditPreviewModalFooter } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { useCommitChanges } from '../../../hooks/useCommitChanges';
import { getAdministrativeDataOptions } from '../../../constants';
import { getMarcFormErrors } from '../BulkEditListResult/BulkEditMarc/validation';
import {
  ADMINISTRATIVE_DEFAULT_BODY,
  ADMINISTRATIVE_FORM_INITIAL_STATE,
  MARC_DEFAULT_BODY,
  MARC_FORM_INITIAL_STATE
} from '../../../constants/forms';

export const BulkEditMarcLayer = ({
  bulkOperationId,
  isMarcLayerOpen,
  onMarcLayerClose,
  paneProps,
}) => {
  const { formatMessage } = useIntl();

  const [fields, setFields] = useState([]);
  const [marcFields, setMarcFields] = useState([getMarcFieldTemplate(uniqueId())]);

  const { marcContentUpdate } = useMarcContentUpdate({ id: bulkOperationId });
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const options = getAdministrativeDataOptions(formatMessage);
  const sortedOptions = sortAlphabetically(options);

  const marcFormErrors = getMarcFormErrors(marcFields);
  const marcContentUpdates = marcFields.map(getTransformedField);
  const marcContentUpdatesWithoutId = marcContentUpdates.map(item => omit(item, ['id']));
  const contentUpdates = getMappedContentUpdates(fields, options);

  const isMarcFormValid = isMarcContentUpdatesFormValid(marcFormErrors);
  const isAdministrativeFormValid = isContentUpdatesFormValid(contentUpdates);

  const isAdministrativeFormPristine = isEqual(ADMINISTRATIVE_FORM_INITIAL_STATE, contentUpdates);
  const isMarcFormPristine = isEqual(MARC_FORM_INITIAL_STATE, marcContentUpdatesWithoutId);

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
    const bulkOperationMarcRules = marcContentUpdates.map((item) => ({
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
  paneProps: PropTypes.object,
  isMarcLayerOpen: PropTypes.bool,
  onMarcLayerClose: PropTypes.func,
};
