import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { useStripes } from '@folio/stripes/core';

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
import { buildCheckboxFilterOptions } from './utils/optionsRecordIdentifiers';
import {
  BULK_EDIT_IDENTIFIERS,
  EDIT_CAPABILITIES,
  BULK_EDIT_QUERY,
  CRITERIES,
} from '../../../constants';
import { getFileInfo } from './utils/getFileInfo';
import { useJobCommand, useFileUploadComand, useUserGroupsMap } from '../../../API';
import { buildQuery } from '../../../hooks';

export const BulkEditListFilters = ({
  isFileUploaded,
  setIsFileUploaded,
  setCountOfRecords,
}) => {
  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);
  const [{ criteria, capabilities, recordIdentifier, queryText }, setFilters] = useState({
    criteria: CRITERIES.IDENTIFIER,
    capabilities: 'inventory',
    queryText: '',
    recordIdentifier: '',
  });
  const stripes = useStripes();
  const showCallout = useShowCallout();
  const history = useHistory();
  const location = useLocation();
  const { userGroups } = useUserGroupsMap();

  const { requestJobId, isLoading } = useJobCommand();
  const { fileUpload } = useFileUploadComand();
  const hasEditOrDeletePerms = stripes.hasPerm('ui-bulk-edit.edit') || stripes.hasPerm('ui-bulk-edit.delete');
  const capabilitiesFilterOptions = buildCheckboxFilterOptions(EDIT_CAPABILITIES);
  const handleChange = (value, field) => setFilters(prev => ({
    ...prev, [field]: value,
  }));

  useEffect(() => {
    if (isFileUploaded || !recordIdentifier) {
      setIsDropZoneDisabled(true);
    } else setIsDropZoneDisabled(false);
  }, [isFileUploaded]);

  useEffect(() => {
    const identifier = new URLSearchParams(location.search).get('identifier');

    if (identifier) {
      handleChange(identifier, 'recordIdentifier');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

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

  const handleRecordIdentifierChange = (e) => {
    handleChange(e.target.value, 'recordIdentifier');

    setIsDropZoneDisabled(false);

    history.replace({
      pathname: location.pathname,
      search: buildSearch({ identifier: e.target.value }, location.search),
    });
  };

  const hanldeCapabilityChange = (e) => setFilters(prev => ({
    ...prev, capabilities: e.target.value,
  }));

  const uploadFileFlow = async (fileToUpload) => {
    setDropZoneActive(false);

    try {
      const { id } = await requestJobId({ recordIdentifier, editType: BULK_EDIT_IDENTIFIERS });

      const recordsCount = await fileUpload({ id, fileToUpload });

      setCountOfRecords(recordsCount);

      const locationParams = new URLSearchParams(location.search).delete('queryText');

      history.replace({
        pathname: `/bulk-edit/${id}/initial`,
        search: buildSearch({ fileName: fileToUpload.name }, locationParams),
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

    const locationParams = new URLSearchParams(location.search).delete('fileName');

    history.replace({
      pathname: `/bulk-edit/${id}/initial`,
      search: buildSearch({ queryText }, locationParams),
    });
  };

  const renderBadge = () => <Badge data-testid="filter-badge">0</Badge>;

  const uploaderSubTitle = useMemo(() => {
    const messagePrefix = recordIdentifier ? `.${recordIdentifier}` : '';

    return <FormattedMessage id={`ui-bulk-edit.uploaderSubTitle${messagePrefix}`} />;
  }, [recordIdentifier]);

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
          disabled={!hasEditOrDeletePerms}
          onChange={handleRecordIdentifierChange}
        />
        <ListFileUploader
          className="FileUploaderContainer"
          isLoading={isLoading}
          isDropZoneActive={isDropZoneActive}
          handleDrop={handleDrop}
          fileExtensionModalOpen={fileExtensionModalOpen}
          hideFileExtensionModal={hideFileExtensionModal}
          isDropZoneDisabled={isDropZoneDisabled}
          recordIdentifier={recordIdentifier}
          handleDragLeave={handleDragLeave}
          handleDragEnter={handleDragEnter}
          disableUploader={!hasEditOrDeletePerms}
          uploaderSubTitle={uploaderSubTitle}
        />
      </>
  }
      <Accordion
        closedByDefault={false}
        displayClearButton={!hasEditOrDeletePerms}
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
              onChange={hanldeCapabilityChange}
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
