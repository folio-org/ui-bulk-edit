import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import {
  Button,
  ButtonGroup,
  Accordion,
  Badge,
} from '@folio/stripes/components';
import { AcqCheckboxFilter, useShowCallout, buildSearch } from '@folio/stripes-acq-components';

import { ListSelect } from './ListSelect/ListSelect';
import { ListFileUploader } from './ListFileUploader/ListFileUploader';
import { buildCheckboxFilterOptions } from './utils/optionsRecordIdentifiers';
import { EDIT_CAPABILITIES } from '../../../constants/optionsRecordIdentifiers';
import { getFileInfo } from './utils/getFileInfo';
import { useJobCommand, useFileUploadComand } from '../../../API/useFileUpload';

export const BulkEditListFilters = ({
  setFileUploadedName,
  isFileUploaded,
  setIsFileUploaded,
}) => {
  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);
  const [{ criteria, capabilities, recordIdentifier }, setFilters] = useState({
    criteria: 'identifier',
    capabilities: ['users'],
    recordIdentifier: null,
  });
  const showCallout = useShowCallout();
  const history = useHistory();
  const location = useLocation();
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);

  const { requestJobId, isLoading } = useJobCommand();
  const { fileUpload } = useFileUploadComand();
  const capabilitiesFilterOptions = buildCheckboxFilterOptions(EDIT_CAPABILITIES);
  const handleChange = (value, field) => setFilters(prev => ({
    ...prev, [field]: value,
  }));

  useEffect(() => {
    if (isFileUploaded || !recordIdentifier) {
      setIsDropZoneDisabled(true);
    } else setIsDropZoneDisabled(false);
  }, [recordIdentifier, isFileUploaded]);

  useEffect(() => {
    const fileName = new URLSearchParams(location.search).get('fileName');
    const identifier = new URLSearchParams(location.search).get('identifier');

    if (identifier) {
      handleChange(identifier, 'recordIdentifier');
    }

    setFileUploadedName(fileName);
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

  const hanldeRecordIdentifier = (e) => {
    handleChange(e.target.value, 'recordIdentifier');
    history.replace({
      pathname: location.pathname,
      search: buildSearch({ identifier: e.target.value }, location.search),
    });
  };

  const hanldeCapabilityChange = (event) => setFilters(prev => ({
    ...prev, capabilities: event.values,
  }));

  const uploadFileFlow = async (fileToUpload) => {
    setFileUploadedName(fileToUpload.name);
    setDropZoneActive(false);

    try {
      const { id } = await requestJobId({ recordIdentifier });

      await fileUpload({ id, fileToUpload });

      history.replace({
        pathname: `/bulk-edit/${id}`,
        search: buildSearch({ fileName: fileToUpload.name }, location.search),
      });

      setIsFileUploaded(true);
    } catch ({ message }) {
      showCallout({ message: <FormattedMessage id="ui-bulk-edit.error.uploadedFile" /> });
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

  const renderBadge = () => <Badge data-testid="filter-badge">0</Badge>;

  const renderTopButtons = () => {
    return (
      <>
        <Button
          buttonStyle={criteria === 'identifier' ? 'primary' : 'default'}
          onClick={() => setFilters(prev => ({ ...prev, criteria: 'identifier' }))}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.identifier" />
        </Button>
        <Button
          buttonStyle={criteria === 'query' ? 'primary' : 'default'}
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
      <ListSelect
        hanldeRecordIdentifier={hanldeRecordIdentifier}
      />
      <ListFileUploader
        isLoading={isLoading}
        isDropZoneActive={isDropZoneActive}
        handleDrop={handleDrop}
        fileExtensionModalOpen={fileExtensionModalOpen}
        hideFileExtensionModal={hideFileExtensionModal}
        isDropZoneDisabled={isDropZoneDisabled}
        recordIdentifier={recordIdentifier}
        handleDragLeave={handleDragLeave}
        handleDragEnter={handleDragEnter}
      />
      <AcqCheckboxFilter
        labelId="ui-bulk-edit.list.filters.capabilities.title"
        options={capabilitiesFilterOptions}
        name="capabilities"
        activeFilters={capabilities}
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
  isFileUploaded: PropTypes.bool.isRequired,
  setIsFileUploaded: PropTypes.func.isRequired,
};
