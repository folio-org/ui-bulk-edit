import React, { useCallback, useContext, useMemo, useState } from 'react';
import { buildSearch, useShowCallout } from '@folio/stripes-acq-components';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import { getCapabilityOptions, isCapabilityDisabled } from '../../../../utils/helpers';
import { ListFileUploader } from '../../../shared/ListFileUploader';
import { Capabilities } from '../../../shared/Capabilities/Capabilities';
import { ListSelect } from '../../../shared/ListSelect/ListSelect';
import {
  CRITERIA,
  EDITING_STEPS,
  IDENTIFIER_FILTERS,
  JOB_STATUSES,
  TRANSLATION_SUFFIX
} from '../../../../constants';
import { useBulkPermissions, useLocationFilters } from '../../../../hooks';
import { useSearchParams } from '../../../../hooks/useSearchParams';
import { useBulkOperationStart, useUpload } from '../../../../hooks/api';
import { getIsDisabledByPerm } from '../utils/getIsDisabledByPerm';
import { RootContext } from '../../../../context/RootContext';

export const IdentifierTab = () => {
  const history = useHistory();
  const location = useLocation();
  const permissions = useBulkPermissions();
  const {
    isFileUploaded,
    setIsFileUploaded,
    setVisibleColumns,
    setInAppCommitted,
  } = useContext(RootContext);
  const {
    criteria,
    initialFileName,
    step,
    capabilities,
    identifier
  } = useSearchParams();
  const showCallout = useShowCallout();

  const [isDropZoneActive, setDropZoneActive] = useState(false);

  const { fileUpload, isLoading } = useUpload();
  const { bulkOperationStart } = useBulkOperationStart();

  const [activeFilters] = useLocationFilters({
    initialFilter: {
      step,
      capabilities,
      identifier,
      criteria: CRITERIA.IDENTIFIER,
      fileName: initialFileName,
    }
  });

  const [recordType] = activeFilters[IDENTIFIER_FILTERS.CAPABILITIES] || [];
  const [recordIdentifier] = activeFilters[IDENTIFIER_FILTERS.IDENTIFIER] || [];

  const isDropZoneDisabled = isFileUploaded || !recordIdentifier || initialFileName;

  const {
    isSelectIdentifiersDisabled,
    hasAnyUserWithBulkPerm,
    hasAnyInventoryWithInAppView,
    isDropZoneDisabledPerm,
    hasInAppEditPerms,
  } = permissions;

  const capabilitiesFilterOptions = getCapabilityOptions(criteria, permissions);


  const isRecordIdentifierSelectDisabled = getIsDisabledByPerm(
    recordType,
    isSelectIdentifiersDisabled,
    hasAnyUserWithBulkPerm,
    hasAnyInventoryWithInAppView
  );

  const isFileUploadDisabled = isDropZoneDisabled || getIsDisabledByPerm(
    recordType,
    isDropZoneDisabledPerm,
    hasAnyUserWithBulkPerm,
    hasAnyInventoryWithInAppView
  );

  const handleRecordIdentifierChange = useCallback((e) => {
    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        identifier: e.target.value,
        step: null,
      }, location.search),
    });

    setIsFileUploaded(false);
    setVisibleColumns(null);
    setInAppCommitted(false);
  }, [location.search]);

  const handleCapabilityChange = (e) => {
    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        capabilities: e.target.value,
        identifier: '',
        step: null,
        fileName: null,
      }, location.search),
    });

    setVisibleColumns(null);
    setIsFileUploaded(false);
    setInAppCommitted(false);
  };

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const uploadFileFlow = async (fileToUpload) => {
    try {
      const { id } = await fileUpload({
        fileToUpload,
        entityType: recordType,
        identifierType: recordIdentifier,
      });

      const { status } = await bulkOperationStart({
        id,
        step: EDITING_STEPS.UPLOAD,
      });

      if (status === JOB_STATUSES.FAILED) throw Error();

      history.replace({
        pathname: `/bulk-edit/${id}/progress`,
        search: buildSearch({ fileName: fileToUpload.name }, location.search),
      });

      setIsFileUploaded(true);
    } catch ({ message }) {
      showCallout({
        message: <FormattedMessage id="ui-bulk-edit.error.uploadedFile" />,
        type: 'error',
      });
    }
  };

  const handleDrop = async (fileToUpload) => {
    if (!fileToUpload) return;

    await uploadFileFlow(fileToUpload);

    setDropZoneActive(false);
  };

  const uploaderSubTitle = useMemo(() => {
    const messagePrefix = recordIdentifier ? `.${recordIdentifier}` : '';
    const key = recordType ?? '';

    return <FormattedMessage id={`ui-bulk-edit.uploaderSubTitle${TRANSLATION_SUFFIX[key]}${messagePrefix}`} />;
  }, [recordIdentifier, recordType]);

  return (
    <>
      <Capabilities
        capabilities={recordType}
        capabilitiesFilterOptions={capabilitiesFilterOptions}
        onCapabilityChange={handleCapabilityChange}
        hasInAppEditPerms={hasInAppEditPerms}
      />
      <ListSelect
        value={recordIdentifier}
        disabled={isRecordIdentifierSelectDisabled}
        onChange={handleRecordIdentifierChange}
        capabilities={recordType}
      />
      <ListFileUploader
        className="FileUploaderContainer"
        isLoading={isLoading}
        isDropZoneActive={isDropZoneActive}
        handleDrop={handleDrop}
        isDropZoneDisabled={isFileUploadDisabled}
        recordIdentifier={recordIdentifier}
        handleDragLeave={handleDragLeave}
        handleDragEnter={handleDragEnter}
        disableUploader={isCapabilityDisabled(recordType, criteria, permissions)}
        uploaderSubTitle={uploaderSubTitle}
      />
    </>
  );
};
