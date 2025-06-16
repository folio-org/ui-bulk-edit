import React, {
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import PropTypes from 'prop-types';
import { buildSearch } from '@folio/stripes-acq-components';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import { getCapabilityOptions, isCapabilityDisabled } from '../../../../utils/helpers';
import { ListFileUploader } from '../../../shared/ListFileUploader';
import { Capabilities } from '../../../shared/Capabilities/Capabilities';
import { ListSelect } from '../../../shared/ListSelect/ListSelect';
import {
  CRITERIA,
  EDITING_STEPS,
  ERRORS,
  IDENTIFIER_FILTERS,
  JOB_STATUSES,
  TRANSLATION_SUFFIX
} from '../../../../constants';
import { useBulkPermissions, useLocationFilters, useSearchParams } from '../../../../hooks';
import { useBulkOperationStart, useUpload } from '../../../../hooks/api';
import { getIsDisabledByPerm } from '../utils/getIsDisabledByPerm';
import { RootContext } from '../../../../context/RootContext';
import { useErrorMessages } from '../../../../hooks/useErrorMessages';

export const IdentifierTab = ({ onClearState }) => {
  const history = useHistory();
  const location = useLocation();
  const permissions = useBulkPermissions();
  const { showErrorMessage } = useErrorMessages();

  const {
    isFileUploaded,
    setIsFileUploaded,
  } = useContext(RootContext);

  const {
    criteria,
    initialFileName,
    step,
    capabilities,
    identifier
  } = useSearchParams();

  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
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
  const isDropZoneDisabled = isFileUploaded || !recordIdentifier || !!initialFileName;
  const capabilitiesFilterOptions = getCapabilityOptions(criteria, permissions);

  const {
    isSelectIdentifiersDisabled,
    hasAnyUserWithBulkPerm,
    hasAnyInventoryWithInAppView,
    isDropZoneDisabledPerm,
    hasInAppEditPerms,
  } = permissions;

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
        criteria: CRITERIA.IDENTIFIER,
        queryRecordType: '',
        step: '',
        fileName: '',
      }, history.location.search),
    });

    onClearState();
  }, [
    history,
    onClearState,
  ]);

  const handleCapabilityChange = (e) => {
    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        capabilities: e.target.value,
        criteria: CRITERIA.IDENTIFIER,
        identifier: '',
        queryRecordType: '',
        step: '',
        fileName: '',
      }, history.location.search),
    });

    onClearState();
  };

  const handleDragEnter = () => {
    setIsDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setIsDropZoneActive(false);
  };

  const uploadFileFlow = async (fileToUpload) => {
    try {
      const { id, errorMessage: uploadErrorMessage } = await fileUpload({
        fileToUpload,
        entityType: recordType,
        identifierType: recordIdentifier,
      });

      if (!uploadErrorMessage) {
        setIsFileUploaded(true);

        const { status, errorMessage } = await bulkOperationStart({
          id,
          step: EDITING_STEPS.UPLOAD,
        });

        if (errorMessage?.includes(ERRORS.TOKEN)) throw Error(ERRORS.TOKEN);
        if (status === JOB_STATUSES.FAILED) throw Error(errorMessage);

        history.replace({
          pathname: `/bulk-edit/${id}/preview`,
          search: buildSearch({ fileName: fileToUpload.name, progress: CRITERIA.IDENTIFIER }, location.search),
        });
      }
    } catch (error) {
      setIsFileUploaded(false);
      showErrorMessage({ errorMessage: error.message }, { fileName: fileToUpload.name });
    }
  };

  const handleDrop = async (fileToUpload) => {
    if (!fileToUpload) return;

    await uploadFileFlow(fileToUpload);

    setIsDropZoneActive(false);
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

IdentifierTab.propTypes = {
  onClearState: PropTypes.func.isRequired,
};
