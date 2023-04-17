import React, { useContext, useRef, useState } from 'react';
import { AppIcon, Pluggable } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import { PrevNextPagination, ResultsPane } from '@folio/stripes-acq-components';
import { contentDataSource, entityTypeDataSource } from '../../../../../test/jest/data/queryPlugin/sources';
import { ActionMenu } from './QueryResultsActionMenu';
import { RootContext } from '../../../../context/RootContext';

export const BulkEditQueryResults = () => {
  const accordionHeadlineRef = useRef(null);
  const { queryResult } = useContext(RootContext);

  const [columnFilterList, setColumnControlList] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);

  const handleColumnsChange = ({ values }) => {
    setVisibleColumns(values);
  };

  const dynamicHeight = (height) => {
    const accordionHeadStaticHeight = 28;
    const paddingsStaticHeight = 30;

    return height
      - PrevNextPagination.HEIGHT
      - (accordionHeadlineRef.current?.clientHeight || accordionHeadStaticHeight)
      - paddingsStaticHeight;
  };

  return (
    <ResultsPane
      id="bulk-edit-query-results"
      autosize
      title="Bulk edit query"
      count={0}
      toggleFiltersPane={noop}
      isFiltersOpened
      isLoading={false}
      padContent
      appIcon={<AppIcon app="bulk-edit" iconKey="app" />}
      renderActionMenu={() => !!queryResult && (
        <ActionMenu
          visibleColumns={visibleColumns}
          columns={columnFilterList}
          onChange={handleColumnsChange}
        />
      )}
    >
      {({ height }) => (
        <>
          {!!queryResult && (
            <Pluggable
              type="query-builder"
              componentType="viewer"
              accordionHeadlineRef={() => accordionHeadlineRef}
              accordionHeadline={
                <div ref={accordionHeadlineRef}>
                  <FormattedMessage
                    id="ui-bulk-edit.accordion.query.title"
                    values={{ query: queryResult?.queryStr }}
                  />
                </div>
              }
              headline={({ totalRecords }) => (
                <FormattedMessage
                  id="ui-bulk-edit.accordion.query.subtitle"
                  values={{ count: totalRecords }}
                />
              )}
              contentDataSource={contentDataSource}
              entityTypeDataSource={entityTypeDataSource}
              visibleColumns={visibleColumns}
              onSetDefaultVisibleColumns={setVisibleColumns}
              onSetDefaultColumns={setColumnControlList}
              height={dynamicHeight(height)}
            >
              No loaded
            </Pluggable>
          )}
        </>
      )}
    </ResultsPane>
  );
};
