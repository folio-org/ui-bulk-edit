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
import { useContentUpdate } from '../../../hooks/api';
import {
  getContentUpdatesBody,
  getMappedContentUpdates,
  isContentUpdatesFormValid
} from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { getMarcFormErrors } from '../BulkEditListResult/BulkEditMarc/validation';
import { getAdministrativeDataOptions } from '../../../constants';
import { sortAlphabetically } from '../../../utils/sortAlphabetically';
import { BulkEditPreviewModalFooter } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { useCommitChanges } from '../../../hooks/useCommitChanges';


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
  const contentUpdates = getMappedContentUpdates(fields, options);

  const isMarcFieldsValid = Object.keys(marcFormErrors).length === 0;
  const isAdministrativeFormValid = isContentUpdatesFormValid(contentUpdates);
  const isAnyFormValid = isMarcFieldsValid || isAdministrativeFormValid;

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

  const handleConfirm = () => {
    const bulkOperationMarcRules = marcFields
      .map(field => ({
        bulkOperationId,
        ...getTransformedField(field),
      }));

    const marcDefaultBody = {
      bulkOperationMarcRules: [],
      totalRecords: 0,
    };

    const administrativeDefaultBody = {
      bulkOperationRules: [],
      totalRecords: 0,
    };

    const marcUpdateBody = isMarcFieldsValid ? {
      bulkOperationMarcRules,
      totalRecords,
    } : marcDefaultBody;

    const administrativeBody = isAdministrativeFormValid ? getContentUpdatesBody({
      bulkOperationId,
      contentUpdates,
      totalRecords,
    }) : administrativeDefaultBody;

    const updateSequence = () => contentUpdate(administrativeBody)
      .then(() => marcContentUpdate(marcUpdateBody));

    confirmChanges(updateSequence);
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
        isJobPreparing={isJobPreparing}
        isPreviewSettled={isPreviewSettled}
        onKeepEditing={closePreviewModal}
        open={isPreviewModalOpened}
        onPreviewSettled={changePreviewSettled}
        modalFooter={
          <BulkEditPreviewModalFooter
            bulkOperationId={bulkOperationId}
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
