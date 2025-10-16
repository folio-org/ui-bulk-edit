import React, { useContext, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import { ButtonGroup, getFirstFocusable } from '@folio/stripes/components';
import { buildSearch } from '@folio/stripes-acq-components';

import { CRITERIA } from '../../../constants';
import { useBulkPermissions, useSearchParams } from '../../../hooks';
import { TabsFilter } from './TabsFilter/TabsFilter';
import { IdentifierTab } from './IdentifierTab/IdentifierTab';
import { QueryTab } from './QueryTab/QueryTab';
import { LogsTab } from './LogsTab/LogsTab';
import { BULK_OPERATION_DETAILS_KEY } from '../../../hooks/api';
import { RootContext } from '../../../context/RootContext';

export const BulkEditListSidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const { hasLogViewPerms, hasQueryPerms } = useBulkPermissions();
  const { criteria } = useSearchParams();
  const queryClient = useQueryClient();
  const {
    setIsFileUploaded,
    setVisibleColumns,
  } = useContext(RootContext);
  const sidebarRef = useRef(null);
  const isQuery = criteria === CRITERIA.QUERY;
  const isLogs = criteria === CRITERIA.LOGS;
  const isIdentifier = criteria === CRITERIA.IDENTIFIER;

  const handleCriteriaChange = (value) => {
    history.replace({
      search: buildSearch({ criteria: value }, location.search),
    });
  };

  const handleClearState = () => {
    setIsFileUploaded(false);
    setVisibleColumns(null);
    queryClient.removeQueries({ queryKey: [BULK_OPERATION_DETAILS_KEY] });
  };

  useEffect(() => {
    const firstFocusable = getFirstFocusable(sidebarRef.current);
    if (firstFocusable) firstFocusable.focus();
  }, []);

  return (
    <div ref={sidebarRef}>
      <ButtonGroup fullWidth>
        <TabsFilter
          criteria={criteria}
          hasLogViewPerms={hasLogViewPerms}
          hasQueryViewPerms={hasQueryPerms}
          onCriteriaChange={handleCriteriaChange}
        />
      </ButtonGroup>

      {/* IDENTIFIER TAB */}
      {isIdentifier && (
        <IdentifierTab onClearState={handleClearState} />
      )}

      {/* QUERY TAB */}
      {isQuery && hasQueryPerms && <QueryTab onClearState={handleClearState} />}

      {/* LOGS TAB */}
      {isLogs && <LogsTab />}
    </div>
  );
};
