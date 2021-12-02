import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import {
  Button,
  ButtonGroup,
  Accordion,
  Badge,
} from '@folio/stripes/components';
import { AcqCheckboxFilter } from '@folio/stripes-acq-components';

import { ListSelect } from './ListSelect/ListSelect';
import { ListFileUploader } from './ListFileUploader/ListFileUploader';
import { buildCheckboxFilterOptions } from './utils/optionsRecordIdentifiers';
import { EDIT_CAPABILITIES } from '../../../constants/optionsRecordIdentifiers';
import { getFileInfo } from './utils/getFileInfo';
import { useFileUploadComand } from '../../../API/useFileUpload';

export const BulkEditListFilters = (
  {
    setFileUploadedName,
    setIsFileUploaded,
    isFileUploaded,
  },
) => {
  const [criteria, setCriteria] = useState('identifier');
  const [isLoading, setLoading] = useState(false);
  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);
  const [filters, setFilter] = useState({
    capabilities: ['users'],
    recordIdentifier: '',
  });
  const history = useHistory();
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);

  const capabilitiesFilterOptions = buildCheckboxFilterOptions(EDIT_CAPABILITIES);

  useEffect(() => {
    if (isFileUploaded || !filters.recordIdentifier) {
      setIsDropZoneDisabled(true);
    } else setIsDropZoneDisabled(false);
  }, [filters.recordIdentifier, isFileUploaded]);
  const renderIdentifierButton = () => {
    return (
      <Button
        buttonStyle={criteria === 'identifier' ? 'primary' : 'default'}
        onClick={() => { setCriteria('identifier'); }}
      >
        <FormattedMessage id="ui-bulk-edit.list.filters.identifier" />
      </Button>
    );
  };

  const renderQueryButton = () => {
    return (
      <Button
        buttonStyle={criteria === 'query' ? 'primary' : 'default'}
        onClick={() => { setCriteria('query'); }}
      >
        <FormattedMessage id="ui-bulk-edit.list.filters.query" />
      </Button>
    );
  };

  const renderBadge = () => <Badge data-testid="filter-badge">0</Badge>;

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const showFileExtensionModal = () => {
    setFileExtensionModalOpen(true);
  };

  const hideFileExtensionModal = () => {
    setFileExtensionModalOpen(false);
  };

  async function handleDrop(acceptedFiles) {
    const fileToUpload = acceptedFiles[0];

    if (!fileToUpload) return;

    const { isTypeSupported } = getFileInfo(fileToUpload);

    if (!isTypeSupported) {
      showFileExtensionModal();
    } else {
      setFileUploadedName(fileToUpload.name);
      setIsFileUploaded(true);
      setDropZoneActive(false);
      history.push('bulk-edit/preview');
    }
  }

  const hanldeCapabilityChange = (event) => setFilter({
    ...filters, capabilities: event.values,
  });

  const hanldeRecordIdentifierChange = (event) => setFilter({
    ...filters, recordIdentifier: event.target.value,
  });

  return (
    <>
      <ButtonGroup fullWidth>
        {renderIdentifierButton()}
        {renderQueryButton()}
      </ButtonGroup>
      <ListSelect
        hanldeRecordIdentifier={hanldeRecordIdentifierChange}
      />
      <ListFileUploader
        isLoading={isLoading}
        isDropZoneActive={isDropZoneActive}
        handleDragEnter={handleDragEnter}
        handleDrop={handleDrop}
        handleDragLeave={handleDragLeave}
        fileExtensionModalOpen={fileExtensionModalOpen}
        setFileExtensionModalOpen={setFileExtensionModalOpen}
        hideFileExtensionModal={hideFileExtensionModal}
        isDropZoneDisabled={isDropZoneDisabled}
      />
      <AcqCheckboxFilter
        labelId="ui-bulk-edit.list.filters.capabilities.title"
        options={capabilitiesFilterOptions}
        name="capabilities"
        activeFilters={filters.capabilities}
        onChange={hanldeCapabilityChange}
        closedByDefault={false}
      />
      <Accordion
        closedByDefault
        displayWhenClosed={renderBadge()}
        displayWhenOpen={renderBadge()}
        label={<FormattedMessage id="ui-bulk-edit.list.savedQueries.title" />}
      />
    </>
  );
};

BulkEditListFilters.propTypes = {
  setFileUploadedName: PropTypes.func.isRequired,
  setIsFileUploaded: PropTypes.func.isRequired,
  isFileUploaded: PropTypes.bool.isRequired,
};
