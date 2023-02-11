import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import {
  ButtonGroup,
} from '@folio/stripes/components';
import { useShowCallout, buildSearch } from '@folio/stripes-acq-components';

import { ListSelect } from './ListSelect/ListSelect';
import { QueryTextArea } from './QueryTextArea/QueryTextArea';
import { ListFileUploader } from '../../ListFileUploader';
import {
  CRITERIA,
  TRANSLATION_SUFFIX,
  EDITING_STEPS, APPROACHES, BULK_VISIBLE_COLUMNS,
} from '../../../constants';
import { useUserGroupsMap } from '../../../hooks/api';
import { useBulkPermissions, useLocationFilters } from '../../../hooks';

import { RootContext } from '../../../context/RootContext';
import { LogsFilters } from './LogsFilters/LogsFilters';
import { useUpload } from '../../../hooks/api/useUpload';
import { useBulkOperationStart } from '../../../hooks/api/useBulkOperationStart';
import { buildQuery } from '../../../utils/buildQuery';
import { getCapabilityOptions, isCapabilityDisabled } from '../../../utils/filters';
import FilterTabs from './FilterTabs/FilterTabs';
import Capabilities from './Capabilities/Capabilities';

export const BulkEditListFilters = ({
  filters,
  setFilters,
  isFileUploaded,
  setIsFileUploaded,
}) => {
  const permissions = useBulkPermissions();
  const {
    isDropZoneDisabled: isDropZoneDisabledPerm,
    hasInAppEditPerms,
    isSelectIdentifiersDisabled,
    hasLogViewPerms,
    hasQueryPerms,
  } = permissions;
  const showCallout = useShowCallout();
  const history = useHistory();
  const location = useLocation();

  const search = new URLSearchParams(location.search);
  const criteria = search.get('criteria');
  const initialCapabilities = search.get('capabilities');

  const isQuery = criteria === CRITERIA.QUERY;
  const isLogs = criteria === CRITERIA.LOGS;
  const isIdentifier = criteria === CRITERIA.IDENTIFIER;
  const { capabilities, recordIdentifier, queryText } = filters;

  const capabilitiesFilterOptions = getCapabilityOptions(criteria, permissions);

  const initialFilter = {
    capabilities: initialCapabilities,
    criteria: CRITERIA.LOGS,
  };

  const [
    activeFilters,
    applyFilters,
    resetFilters,
  ] = useLocationFilters({ location, history, initialFilter });

  const applyFiltersAdapter = (callBack) => ({ name, values }) => callBack(name, values);

  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  const { setVisibleColumns } = useContext(RootContext);
  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);

  const { userGroups } = useUserGroupsMap();
  const { fileUpload, isLoading } = useUpload();
  const { bulkOperationStart } = useBulkOperationStart();

  const handleChange = (value, field) => setFilters(prev => ({
    ...prev, [field]: value,
  }));

  const handleCapabilityChange = (e) => {
    const value = e.target.value;

    setFilters(prev => ({
      ...prev,
      capabilities: value,
      recordIdentifier: '',
    }));

    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        capabilities: value,
        identifier: null,
      }, location.search),
    });

    setIsFileUploaded(false);
    // clear visibleColumns preset
    localStorage.removeItem(BULK_VISIBLE_COLUMNS);
    setVisibleColumns(null);
  };

  const handleCriteriaChange = (value) => {
    setFilters(prev => ({ ...prev, criteria: value }));
    history.replace({
      search: buildSearch({ criteria: value }, location.search),
    });
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
      pathname: '/bulk-edit',
      search: buildSearch({ identifier: e.target.value, capabilities, criteria }),
    });

    setIsFileUploaded(false);
  }, [location.search]);

  const uploadFileFlow = async (fileToUpload) => {
    try {
      const { id } = await fileUpload({
        fileToUpload,
        entityType: capabilities,
        identifierType: recordIdentifier,
      });

      await bulkOperationStart({
        id,
        step: EDITING_STEPS.UPLOAD,
      });

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

  const handleQuerySearch = async () => {
    const parsedQuery = buildQuery(queryText, userGroups);

    const { id } = await bulkOperationStart({
      id: uuidv4(),
      step: EDITING_STEPS.UPLOAD,
      query: parsedQuery,
      approach: APPROACHES.QUERY,
      entityType: capabilities,
    });

    history.replace({
      pathname: `/bulk-edit/${id}/progress`,
      search: buildSearch({ queryText }, location.search),
    });
  };

  const uploaderSubTitle = useMemo(() => {
    const messagePrefix = recordIdentifier ? `.${recordIdentifier}` : '';

    return <FormattedMessage id={`ui-bulk-edit.uploaderSubTitle${TRANSLATION_SUFFIX[capabilities]}${messagePrefix}`} />;
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
  }, [location.search]);

  const renderCapabilities = () => (
    <Capabilities
      capabilities={capabilities}
      capabilitiesFilterOptions={capabilitiesFilterOptions}
      onCapabilityChange={handleCapabilityChange}
      hasInAppEditPerms={hasInAppEditPerms}
    />
  );

  const renderQueryText = () => (
    <QueryTextArea
      queryText={queryText}
      setQueryText={setFilters}
      handleQuerySearch={handleQuerySearch}
      disabled={isCapabilityDisabled(capabilities, criteria, permissions)}
    />
  );

  const renderListSelect = () => (
    <ListSelect
      value={recordIdentifier}
      disabled={isSelectIdentifiersDisabled}
      onChange={handleRecordIdentifierChange}
      capabilities={capabilities}
    />
  );

  const renderListFileUploader = () => (
    <ListFileUploader
      className="FileUploaderContainer"
      isLoading={isLoading}
      isDropZoneActive={isDropZoneActive}
      handleDrop={handleDrop}
      isDropZoneDisabled={isDropZoneDisabled || isDropZoneDisabledPerm}
      recordIdentifier={recordIdentifier}
      handleDragLeave={handleDragLeave}
      handleDragEnter={handleDragEnter}
      disableUploader={isCapabilityDisabled(capabilities, criteria, permissions)}
      uploaderSubTitle={uploaderSubTitle}
    />
  );

  const renderLogsFilter = () => (
    <LogsFilters
      activeFilters={activeFilters}
      onChange={adaptedApplyFilters}
      resetFilter={resetFilters}
    />
  );

  return (
    <>
      <ButtonGroup fullWidth>
        <FilterTabs
          criteria={criteria}
          hasLogViewPerms={hasLogViewPerms}
          hasQueryViewPerms={hasQueryPerms}
          onCriteriaChange={handleCriteriaChange}
        />
      </ButtonGroup>

      {/* IDENTIFIER FILTER */}
      {isIdentifier && (
        <>
          {renderCapabilities()}
          {renderListSelect()}
          {renderListFileUploader()}
        </>
      )}

      {/* QUERY FILTER */}
      {isQuery && hasQueryPerms && (
        <>
          {renderCapabilities()}
          {renderQueryText()}
        </>
      )}

      {/* LOGS FILTER */}
      {isLogs && renderLogsFilter()}
    </>
  );
};

BulkEditListFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  isFileUploaded: PropTypes.bool.isRequired,
  setIsFileUploaded: PropTypes.func.isRequired,
};
