import React from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

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
import { findRecordType, getCapabilityOptions } from '../../../../utils/helpers';
import { CRITERIA, QUERY_FILTERS } from '../../../../constants';


export const QueryTab = ({ onClearState }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const {
    queryRecordType,
    criteria,
    step,
    initialFileName
  } = useSearchParams();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');

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
  const recordTypeId = findRecordType(recordTypes, recordType, formatMessage)?.id;
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

    onClearState();
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
