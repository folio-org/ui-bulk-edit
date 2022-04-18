import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import {
  Button,
  ButtonGroup,
  Accordion,
  Badge,
  RadioButtonGroup,
  RadioButton,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { useShowCallout, buildSearch } from '@folio/stripes-acq-components';

import { ListSelect } from './ListSelect/ListSelect';
import { QueryTextArea } from './QueryTextArea/QueryTextArea';
import { ListFileUploader } from '../../ListFileUploader';
import {
  BULK_EDIT_IDENTIFIERS,
  EDIT_CAPABILITIES,
  BULK_EDIT_QUERY,
  CRITERIES, CAPABILITIES,
} from '../../../constants';
import { getFileInfo } from './utils/getFileInfo';
import { useJobCommand, useFileUploadComand, useUserGroupsMap } from '../../../API';
import { buildQuery } from '../../../hooks';
import { useBulkPermissions } from '../../../hooks/bulkPermissions';

export const BulkEditListFilters = ({
  isFileUploaded,
  setIsFileUploaded,
  setCountOfRecords,
}) => {
  const showCallout = useShowCallout();
  const history = useHistory();
  const location = useLocation();
  const {
    isDropZoneDisabled: isDropZoneDisabledPerm,
    hasOnlyInAppViewPerms,
    isInventoryRadioDisabled,
    isUserRadioDisabled,
    hasInAppEditPerms,
    isSelectIdentifiersDisabled,
  } = useBulkPermissions();
  const search = new URLSearchParams(location.search);

  const getDefaultCapabilities = () => {
    if (hasOnlyInAppViewPerms) {
      return CAPABILITIES.ITEM;
    }

    return search.get('capabilities') || CAPABILITIES.USER;
  };

  const defaultCapability = getDefaultCapabilities();

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);
  const [{ criteria, capabilities, recordIdentifier, queryText }, setFilters] = useState({
    criteria: CRITERIES.IDENTIFIER,
    capabilities: defaultCapability,
    queryText: '',
    recordIdentifier: '',
  });
  const { userGroups } = useUserGroupsMap();
  const { requestJobId, isLoading } = useJobCommand({ entityType: capabilities.slice(0, -1) });
  const { fileUpload } = useFileUploadComand();

  const isCapabilityDisabled = (capabilityValue) => {
    switch (capabilityValue) {
      case CAPABILITIES.USER:
        return isUserRadioDisabled;
      case CAPABILITIES.ITEM:
        return isInventoryRadioDisabled;
      default:
        return true;
    }
  };

  const capabilitiesFilterOptions = EDIT_CAPABILITIES.map(capability => ({
    ...capability,
    disabled: isCapabilityDisabled(capability.value),
  }));

  const handleChange = (value, field) => setFilters(prev => ({
    ...prev, [field]: value,
  }));

  const showFileExtensionModal = () => {
    setFileExtensionModalOpen(true);
  };

  const hideFileExtensionModal = () => {
    setFileExtensionModalOpen(false);
  };

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const handleRecordIdentifierChange = useCallback((e) => {
    handleChange(e.target.value, 'recordIdentifier');

    history.replace({
      pathname: location.pathname,
      search: buildSearch({ identifier: e.target.value }, location.search),
    });

    setIsFileUploaded(false);
  }, [location.search]);

  const handleCapabilityChange = (e) => {
    setFilters(prev => ({
      ...prev,
      capabilities: e.target.value,
      recordIdentifier: '',
    }));

    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({ capabilities }),
    });

    setIsFileUploaded(false);
  };

  const uploadFileFlow = async (fileToUpload) => {
    setDropZoneActive(false);

    try {
      const { id } = await requestJobId({ recordIdentifier, editType: BULK_EDIT_IDENTIFIERS });

      const recordsCount = await fileUpload({ id, fileToUpload });

      setCountOfRecords(recordsCount);

      search.delete('queryText');

      history.replace({
        pathname: `/bulk-edit/${id}/initial`,
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

  const handleDrop = async (acceptedFiles) => {
    const fileToUpload = acceptedFiles[0];
    const { isTypeSupported } = getFileInfo(fileToUpload);

    if (isTypeSupported) {
      await uploadFileFlow(fileToUpload);
    } else {
      showFileExtensionModal();
    }
  };

  const handleQuerySearch = async () => {
    const parsedQuery = buildQuery(queryText, userGroups);

    const { id } = await requestJobId({
      recordIdentifier,
      editType: BULK_EDIT_QUERY,
      specificParameters: { query: parsedQuery },
    });

    search.delete('fileName');

    history.replace({
      pathname: `/bulk-edit/${id}/initial`,
      search: buildSearch({ queryText }, location.search),
    });
  };

  const uploaderSubTitle = useMemo(() => {
    const messagePrefix = recordIdentifier ? `.${recordIdentifier}` : '';

    return <FormattedMessage id={`ui-bulk-edit.uploaderSubTitle${messagePrefix}`} />;
  }, [recordIdentifier]);

  useEffect(() => {
    if (isFileUploaded || !recordIdentifier) {
      setIsDropZoneDisabled(true);
    } else {
      setIsDropZoneDisabled(false);
    }
  }, [isFileUploaded, recordIdentifier]);

  useEffect(() => {
    const identifier = search.get('identifier');

    if (identifier) {
      handleChange(identifier, 'recordIdentifier');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    history.replace({
      pathname: location.pathname,
      search: buildSearch({ capabilities }, location.search),
    });
  }, [capabilities]);

  const renderBadge = () => <Badge data-testid="filter-badge">0</Badge>;

  const renderTopButtons = () => {
    return (
      <>
        <Button
          buttonStyle={criteria === CRITERIES.IDENTIFIER ? 'primary' : 'default'}
          onClick={() => setFilters(prev => ({ ...prev, criteria: 'identifier' }))}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.identifier" />
        </Button>
        <Button
          buttonStyle={criteria === CRITERIES.QUERY ? 'primary' : 'default'}
          onClick={() => setFilters(prev => ({ ...prev, criteria: 'query' }))}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.query" />
        </Button>
      </>
    );
  };

  return (
    <>
      <ButtonGroup fullWidth>
        {renderTopButtons()}
      </ButtonGroup>
      {criteria === CRITERIES.QUERY && (
        <QueryTextArea
          queryText={queryText}
          setQueryText={setFilters}
          handleQuerySearch={handleQuerySearch}
        />
      )}
      {criteria === CRITERIES.IDENTIFIER &&
      <>
        <ListSelect
          value={recordIdentifier}
          disabled={isSelectIdentifiersDisabled}
          onChange={handleRecordIdentifierChange}
          capabilities={capabilities}
        />
        <ListFileUploader
          className="FileUploaderContainer"
          isLoading={isLoading}
          isDropZoneActive={isDropZoneActive}
          handleDrop={handleDrop}
          fileExtensionModalOpen={fileExtensionModalOpen}
          hideFileExtensionModal={hideFileExtensionModal}
          isDropZoneDisabled={isDropZoneDisabled && isDropZoneDisabledPerm}
          recordIdentifier={recordIdentifier}
          handleDragLeave={handleDragLeave}
          handleDragEnter={handleDragEnter}
          disableUploader={isCapabilityDisabled(capabilities)}
          uploaderSubTitle={uploaderSubTitle}
        />
      </>
  }
      <Accordion
        separator={false}
        closedByDefault={false}
        displayClearButton={!hasInAppEditPerms}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-bulk-edit.list.filters.capabilities.title" />}
      >
        <RadioButtonGroup>
          {capabilitiesFilterOptions.map(option => (
            <RadioButton
              key={option.value}
              label={option.label}
              name="capabilities"
              value={option.value}
              disabled={option.disabled}
              onChange={handleCapabilityChange}
              checked={option.value === capabilities}
            />
          ))}
        </RadioButtonGroup>
      </Accordion>
      <Accordion
        closedByDefault
        displayWhenClosed={renderBadge()}
        displayWhenOpen={renderBadge()}
        label={<FormattedMessage id="ui-bulk-edit.list.savedQueries.title" />}
      >
        <div />
      </Accordion>
    </>
  );
};

BulkEditListFilters.propTypes = {
  isFileUploaded: PropTypes.bool.isRequired,
  setIsFileUploaded: PropTypes.func.isRequired,
  setCountOfRecords: PropTypes.func.isRequired,
};
