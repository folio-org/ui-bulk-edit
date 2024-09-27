import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { saveAs } from 'file-saver';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditManualUploadModal } from './BulkEditListResult/BulkEditManualUploadModal';
import {
  usePathParams,
  useBulkPermissions,
  useSearchParams,
  useResetAppState,
  useInAppApproach,
  useMarkApproach,
  useManualApproach
} from '../../hooks';
import {
  CRITERIA,
  APPROACHES,
  FILE_SEARCH_PARAMS,
  FILE_TO_LINK,
} from '../../constants';
import { RootContext } from '../../context/RootContext';
import { BulkEditLogs } from '../BulkEditLogs/BulkEditLogs';
import { BulkEditListSidebar } from './BulkEditListSidebar/BulkEditListSidebar';
import {
  QUERY_KEY_DOWNLOAD_ACTION_MENU,
  useBulkOperationDetails,
  useFileDownload
} from '../../hooks/api';
import { BulkEditQuery } from './BulkEditQuery/BulkEditQuery';
import { BulkEditIdentifiers } from './BulkEditIdentifiers/BulkEditIdentifiers';
import { useResetFilters } from '../../hooks/useResetFilters';

import { BulkEditInAppLayer } from './BulkEditInAppLayer/BulkEditInAppLayer';
import { BulkEditMarkLayer } from './BulkEditMarkLayer/BulkEditMarkLayer';

export const BulkEditPane = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState(null);
  const [confirmedFileName, setConfirmedFileName] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const { isActionMenuShown } = useBulkPermissions();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const {
    step,
    criteria,
    initialFileName,
  } = useSearchParams();

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId, additionalQueryKeys: [step] });
  const { filtersTab } = useResetFilters();

  const inAppApproach = useInAppApproach();
  const {
    openInAppLayer,
    closeInAppLayer
  } = inAppApproach;

  const markApproach = useMarkApproach();
  const {
    fields,
    setFields,
    openMarkLayer,
    closeMarkLayer
  } = markApproach;

  const {
    isBulkEditModalOpen,
    openManualModal,
    closeManualModal,
  } = useManualApproach();

  const isLogsTab = criteria === CRITERIA.LOGS;
  const isQueryTab = criteria === CRITERIA.QUERY;
  const isIdentifierTab = criteria === CRITERIA.IDENTIFIER;
  const isQueryTabWithPreview = isQueryTab && visibleColumns?.length && bulkDetails?.fqlQuery;
  const isIdentifierTabWithPreview = isIdentifierTab && visibleColumns?.length && !bulkDetails?.fqlQuery;
  const isActionMenuVisible = (isQueryTabWithPreview || isIdentifierTabWithPreview) && isActionMenuShown && !isLogsTab;

  const title = useMemo(() => {
    if (bulkDetails?.userFriendlyQuery) return <FormattedMessage id="ui-bulk-edit.preview.query.title" values={{ queryText: bulkDetails.userFriendlyQuery }} />;

    return <FormattedMessage id="ui-bulk-edit.preview.file.title" values={{ fileUploadedName: initialFileName }} />;
  }, [bulkDetails?.userFriendlyQuery, initialFileName]);

  const providerValue = useMemo(() => ({
    countOfRecords,
    setCountOfRecords,
    visibleColumns,
    setVisibleColumns,
    confirmedFileName,
    isFileUploaded,
    setIsFileUploaded,
    setFields,
    fields,
    title,
  }), [
    countOfRecords,
    visibleColumns,
    confirmedFileName,
    isFileUploaded,
    setFields,
    fields,
    title
  ]);

  useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_ACTION_MENU,
    enabled: !!fileInfo,
    id: bulkOperationId,
    fileInfo: {
      fileContentType: FILE_SEARCH_PARAMS[fileInfo?.param]?.replace('_MARC', ''),
    },
    onSuccess: data => {
      /* istanbul ignore next */
      saveAs(new Blob([data]), fileInfo?.bulkDetails[FILE_TO_LINK[fileInfo?.param]].split('/')[1]);
    },
    onSettled: () => {
      /* istanbul ignore next */
      setFileInfo(null);
    },
  });

  useResetAppState({
    setConfirmedFileName,
    setCountOfRecords,
    setVisibleColumns,
    filtersTab,
    closeInAppLayer,
    closeMarkLayer,
  });

  const handleStartBulkEdit = useCallback((approach) => {
    if (approach === APPROACHES.IN_APP) {
      openInAppLayer();
    }

    if (approach === APPROACHES.MANUAL) {
      openManualModal();
    }

    if (approach === APPROACHES.MARK) {
      openMarkLayer();
    }
  }, [openInAppLayer, openManualModal, openMarkLayer]);

  const renderActionMenu = ({ onToggle }) => isActionMenuVisible && (
    <BulkEditActionMenu
      onEdit={handleStartBulkEdit}
      onToggle={onToggle}
      setFileInfo={setFileInfo}
    />
  );

  const renderLayers = (paneProps) => (
    <>
      <BulkEditInAppLayer
        bulkOperationId={bulkOperationId}
        paneProps={paneProps}
        {...inAppApproach}
      />
      <BulkEditMarkLayer
        bulkOperationId={bulkOperationId}
        paneProps={paneProps}
        {...markApproach}
      />
      <BulkEditManualUploadModal
        operationId={bulkOperationId}
        open={isBulkEditModalOpen}
        onCancel={closeManualModal}
        countOfRecords={countOfRecords}
        setCountOfRecords={setCountOfRecords}
      />
    </>
  );

  return (
    <RootContext.Provider value={providerValue}>
      <Paneset>
        {/* LOGS_FILTERS PANE */}
        <Pane
          defaultWidth="300px"
          paneTitle={<FormattedMessage id="ui-bulk-edit.list.criteriaTitle" />}
        >
          <BulkEditListSidebar />
        </Pane>

        {/* RESULT PANES */}
        { isIdentifierTab && (
          <BulkEditIdentifiers
            bulkDetails={bulkDetails}
            actionMenu={renderActionMenu}
          >
            {renderLayers}
          </BulkEditIdentifiers>
        )}

        { isQueryTab && (
          <BulkEditQuery
            bulkDetails={bulkDetails}
            actionMenu={renderActionMenu}
          >
            {renderLayers}
          </BulkEditQuery>
        )}

        { isLogsTab && <BulkEditLogs /> }
      </Paneset>

    </RootContext.Provider>
  );
};
