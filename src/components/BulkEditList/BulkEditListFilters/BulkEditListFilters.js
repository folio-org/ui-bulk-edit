import React,
{ useContext,
  useState,
  useEffect,
  useMemo,
  useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import {
  ButtonGroup,
} from '@folio/stripes/components';
import { Pluggable, useOkapiKy } from '@folio/stripes/core';
import { useShowCallout, buildSearch } from '@folio/stripes-acq-components';

import { ListSelect } from './ListSelect/ListSelect';
import { ListFileUploader } from '../../ListFileUploader';
import {
  CRITERIA,
  JOB_STATUSES,
  TRANSLATION_SUFFIX,
  EDITING_STEPS,
  FILTERS,
} from '../../../constants';
import { RootContext } from '../../../context/RootContext';
import {
  useUpload,
  useBulkOperationStart,
} from '../../../hooks/api';
import { useBulkPermissions, useLocationFilters } from '../../../hooks';
import { LogsFilters } from './LogsFilters/LogsFilters';
import { getCapabilityOptions, isCapabilityDisabled } from '../../../utils/helpers';
import FilterTabs from './FilterTabs/FilterTabs';
import Capabilities from './Capabilities/Capabilities';
import { getIsDisabledByPerm } from './utils/getIsDisabledByPerm';
import { useRecordTypes } from '../../../hooks/api/useRecordTypes';
import { getRecordType } from '../../../utils/getRecordType';

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
    hasUsersViewPerms,
    hasInventoryInstanceViewPerms,
    hasCsvViewPerms,
    hasInAppUsersEditPerms,
    hasInAppViewPerms,
    hasAnyInventoryWithInAppView,
    hasAnyUserWithBulkPerm,
  } = permissions;
  const showCallout = useShowCallout();
  const history = useHistory();
  const ky = useOkapiKy();
  const location = useLocation();

  const search = new URLSearchParams(location.search);
  const criteria = search.get('criteria');
  const initialCapabilities = search.get('capabilities');
  const initialFileName = search.get('fileName');
  const initialStep = search.get('step');
  const initialRecordType = search.get('recordTypes');
  const logFilters = Object.values(FILTERS).map((el) => search.getAll(el));

  const isQuery = criteria === CRITERIA.QUERY;
  const isLogs = criteria === CRITERIA.LOGS;
  const isIdentifier = criteria === CRITERIA.IDENTIFIER;
  const { capabilities, recordIdentifier } = filters;

  const capabilitiesFilterOptions = getCapabilityOptions(criteria, permissions);

  const isQueryBuilderEnabledForUsers = hasUsersViewPerms && (hasCsvViewPerms || hasInAppUsersEditPerms);
  const isQueryBuilderEnabledForItems = hasInventoryInstanceViewPerms && hasInAppViewPerms;
  const isQueryBuilderDisabled = !isQueryBuilderEnabledForUsers && !isQueryBuilderEnabledForItems;

  const initialFilter = {
    capabilities: initialCapabilities,
    criteria: CRITERIA.LOGS,
    fileName: initialFileName,
    step: initialStep,
    recordTypes: initialRecordType,
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

  const { setVisibleColumns, setInAppCommitted } = useContext(RootContext);
  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);

  const { fileUpload, isLoading } = useUpload();
  const { bulkOperationStart } = useBulkOperationStart();

  const { recordTypes } = useRecordTypes();

  const entityTypeDataSource = async () => {
    if (initialRecordType) {
      return ky.get(`entity-types/${initialRecordType}`).json();
    }
    return null;
  };

  const queryDetailsDataSource = async ({ queryId, includeContent, offset, limit }) => {
    const searchParams = {
      includeResults: includeContent,
      offset,
      limit
    };

    return ky.get(`query/${queryId}`, { searchParams }).json();
  };

  const testQueryDataSource = async ({ fqlQuery }) => {
    return ky.post('query', { json: {
      entityTypeId: initialRecordType,
      fqlQuery: JSON.stringify(fqlQuery)
    } }).json();
  };

  const getParamsSource = async ({ entityTypeId, columnName, searchValue }) => {
    return ky.get(`entity-types/${entityTypeId}/columns/${columnName}/values?search=${searchValue}`).json();
  };

  const cancelQueryDataSource = async ({ queryId }) => {
    return ky.delete(`query/${queryId}`);
  };

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

    const selected = recordTypes?.find(type => type.label === getRecordType(value))?.id;

    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        capabilities: value,
        identifier: null,
        step: null,
        fileName: null,
        recordTypes: selected
      }, location.search),
    });

    setVisibleColumns(null);
    setIsFileUploaded(false);
    setInAppCommitted(false);
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
    const [status, entityType, operationType, startTime, endTime] = logFilters;

    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        identifier: e.target.value,
        capabilities: initialCapabilities,
        criteria,
        status,
        entityType,
        endTime,
        startTime,
        operationType,
        step: null,
      }),
    });

    setVisibleColumns(null);
    setIsFileUploaded(false);
    setInAppCommitted(false);
  }, [location.search]);

  const uploadFileFlow = async (fileToUpload) => {
    try {
      const { id } = await fileUpload({
        fileToUpload,
        entityType: capabilities,
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

    return <FormattedMessage id={`ui-bulk-edit.uploaderSubTitle${TRANSLATION_SUFFIX[capabilities]}${messagePrefix}`} />;
  }, [recordIdentifier]);

  useEffect(() => {
    if (isFileUploaded || !recordIdentifier || initialFileName) {
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

    if (initialCapabilities) {
      handleChange(initialCapabilities, 'capabilities');
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

  const renderListSelect = () => (
    <ListSelect
      value={recordIdentifier}
      disabled={getIsDisabledByPerm(capabilities,
        isSelectIdentifiersDisabled,
        hasAnyUserWithBulkPerm,
        hasAnyInventoryWithInAppView)}
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
      isDropZoneDisabled={isDropZoneDisabled
          ||
          getIsDisabledByPerm(capabilities,
            isDropZoneDisabledPerm,
            hasAnyUserWithBulkPerm,
            hasAnyInventoryWithInAppView)}
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
          <Pluggable
            componentType="builder"
            type="query-builder"
            disabled={isQueryBuilderDisabled}
            key={capabilities}
            entityTypeDataSource={entityTypeDataSource}
            testQueryDataSource={testQueryDataSource}
            getParamsSource={getParamsSource}
            queryDetailsDataSource={queryDetailsDataSource}
            onQueryRunFail={() => {}}
            cancelQueryDataSource={cancelQueryDataSource}
          />
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
