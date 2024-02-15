import React from 'react';
import {
  useHistory,
  useLocation
} from 'react-router-dom';

import { Pluggable } from '@folio/stripes/core';
import { buildSearch } from '@folio/stripes-acq-components';
import { Capabilities } from '../../../shared/Capabilities/Capabilities';
import { useRecordTypes } from '../../../../hooks/api/useRecordTypes';
import { getRecordType } from '../../../../utils/getRecordType';
import { useQueryPlugin } from '../../../../hooks/api';
import { useSearchParams } from '../../../../hooks/useSearchParams';
import {
  useBulkPermissions,
  useLocationFilters
} from '../../../../hooks';
import { getCapabilityOptions } from '../../../../utils/helpers';
import { CRITERIA, QUERY_FILTERS } from '../../../../constants';

export const QueryTab = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    queryRecordType,
    criteria,
    step,
    initialFileName
  } = useSearchParams();
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
  const recordTypeId = recordTypes?.find(type => type.label === getRecordType(recordType))?.id;
  const isQueryBuilderEnabledForUsers = hasUsersViewPerms && (hasCsvViewPerms || hasInAppUsersEditPerms);
  const isQueryBuilderEnabledForItems = hasInventoryInstanceViewPerms && hasInAppViewPerms;
  const isQueryBuilderDisabled = (!isQueryBuilderEnabledForUsers && !isQueryBuilderEnabledForItems) || !recordTypeId;

  const {
    entityTypeDataSource,
    queryDetailsDataSource,
    testQueryDataSource,
    getParamsSource,
    cancelQueryDataSource,
    runQueryDataSource
  } = useQueryPlugin(recordTypeId);

  const handleCapabilityChange = (e) => {
    history.replace({
      search: buildSearch({
        queryRecordType: e.target.value,
      }, history.location.search),
    });
  };

  const onQueryRunSuccess = ({ id }) => {
    history.replace({
      pathname: `/bulk-edit/${id}/progress`,
      search: buildSearch({}, location.search),
    });
  };


  return (
    <>
      <Capabilities
        capabilities={queryRecordType}
        capabilitiesFilterOptions={capabilitiesFilterOptions}
        onCapabilityChange={handleCapabilityChange}
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
      />
    </>
  );
};
