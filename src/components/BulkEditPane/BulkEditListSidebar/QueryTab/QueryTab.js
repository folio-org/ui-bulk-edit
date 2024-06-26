import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Pluggable } from '@folio/stripes/core';
import { buildSearch } from '@folio/stripes-acq-components';
import { Capabilities } from '../../../shared/Capabilities/Capabilities';
import { useRecordTypes } from '../../../../hooks/api/useRecordTypes';
import { useQueryPlugin } from '../../../../hooks/api';
import { useSearchParams } from '../../../../hooks/useSearchParams';
import {
  useBulkPermissions,
  useLocationFilters,
  usePathParams
} from '../../../../hooks';
import { getCapabilityOptions } from '../../../../utils/helpers';
import { CRITERIA, QUERY_FILTERS, RECORD_TYPES } from '../../../../constants';
import { RootContext } from '../../../../context/RootContext';

export const QueryTab = () => {
  const history = useHistory();

  const {
    queryRecordType,
    criteria,
    step,
    initialFileName
  } = useSearchParams();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');

  const {
    setIsFileUploaded,
    setVisibleColumns,
  } = useContext(RootContext);

  const { recordTypes } = useRecordTypes();
  const permissions = useBulkPermissions();
  const {
    hasInAppEditPerms,
    hasInAppViewPerms,
    hasInventoryInstanceViewPerms,
    hasUsersViewPerms,
    hasCsvViewPerms,
    hasInAppUsersEditPerms,
  } = permissions;

  const [activeFilters] = useLocationFilters({
    initialFilter: {
      step,
      queryRecordType,
      criteria: CRITERIA.QUERY,
      fileName: initialFileName,
    }
  });

  const [recordType] = activeFilters[QUERY_FILTERS.RECORD_TYPE] || [];
  const capabilitiesFilterOptions = getCapabilityOptions(criteria, permissions);
  const recordTypeId = recordTypes?.find(type => type.label === RECORD_TYPES[recordType])?.id;
  const isQueryBuilderEnabledForUsers = hasUsersViewPerms && (hasCsvViewPerms || hasInAppUsersEditPerms);
  const isQueryBuilderEnabledForItems = hasInventoryInstanceViewPerms && hasInAppViewPerms;
  const isQueryBuilderDisabled =
    (!isQueryBuilderEnabledForUsers && !isQueryBuilderEnabledForItems)
    || !recordTypeId
    || bulkOperationId;

  const {
    entityTypeDataSource,
    queryDetailsDataSource,
    testQueryDataSource,
    getParamsSource,
    cancelQueryDataSource,
    runQueryDataSource
  } = useQueryPlugin(recordTypeId);

  const handleQueryRecordTypeChange = (e) => {
    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        queryRecordType: e.target.value,
        criteria: CRITERIA.QUERY,
        step: '',
        capabilities: '',
        identifier: '',
        fileName: '',
      }, history.location.search),
    });

    setIsFileUploaded(false);
    setVisibleColumns(null);
  };

  const onQueryRunSuccess = ({ id }) => {
    history.replace({
      pathname: `/bulk-edit/${id}/preview`,
      search:  buildSearch({
        fileName: null,
        progress: CRITERIA.QUERY,
      }, history.location.search),
    });
  };


  return (
    <>
      <Capabilities
        capabilities={queryRecordType}
        capabilitiesFilterOptions={capabilitiesFilterOptions}
        onCapabilityChange={handleQueryRecordTypeChange}
        hasInAppEditPerms={hasInAppEditPerms}
      />
      <Pluggable
        componentType="builder"
        type="query-builder"
        disabled={isQueryBuilderDisabled}
        key={recordTypeId}
        entityTypeDataSource={entityTypeDataSource}
        testQueryDataSource={testQueryDataSource}
        getParamsSource={getParamsSource}
        queryDetailsDataSource={queryDetailsDataSource}
        onQueryRunFail={() => {}}
        cancelQueryDataSource={cancelQueryDataSource}
        onQueryRunSuccess={onQueryRunSuccess}
        runQueryDataSource={runQueryDataSource}
        recordsLimit={100000}
        canRunEmptyQuery={false}
      />
    </>
  );
};
