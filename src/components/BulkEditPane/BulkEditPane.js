import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

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
  useMarcApproach,
  useManualApproach
} from '../../hooks';
import {
  CRITERIA,
  APPROACHES,
  FILE_SEARCH_PARAMS,
  FILE_KEYS,
} from '../../constants';
import { RootContext } from '../../context/RootContext';
import { BulkEditLogs } from '../BulkEditLogs/BulkEditLogs';
import { BulkEditListSidebar } from './BulkEditListSidebar/BulkEditListSidebar';
import {
  QUERY_KEY_DOWNLOAD_ACTION_MENU,
  useBulkOperationDetails,
  useBulkOperationTenants,
  useFileDownload
} from '../../hooks/api';
import { BulkEditQuery } from './BulkEditQuery/BulkEditQuery';
import { BulkEditIdentifiers } from './BulkEditIdentifiers/BulkEditIdentifiers';
import { useResetFilters } from '../../hooks/useResetFilters';

import { BulkEditFolioLayer } from './BulkEditFolioLayer/BulkEditFolioLayer';
import { BulkEditMarcLayer } from './BulkEditMarcLayer/BulkEditMarcLayer';
import { savePreviewFile } from '../../utils/files';
import { getBulkOperationStatsByStep, iseRecordsPreviewAvailable } from './BulkEditListResult/PreviewLayout/helpers';
import { BulkEditProfileFlow } from './BulkEditListResult/BulkEditProfileFlow/BulkEditProfileFlow';
import { TenantsProvider } from '../../context/TenantsContext';

export const BulkEditPane = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState(null);
  const [draftVisibleColumns, setDraftVisibleColumns] = useState(null);
  const [confirmedFileName, setConfirmedFileName] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { isActionMenuShown } = useBulkPermissions();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');

  const {
    step,
    criteria,
    initialFileName,
    setParam
  } = useSearchParams();

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId });
  const { filtersTab } = useResetFilters();
  const { bulkOperationTenants } = useBulkOperationTenants(bulkOperationId, {
    enabled: !!bulkOperationId && iseRecordsPreviewAvailable(bulkDetails, step)
  });

  const {
    openInAppLayer,
    closeInAppLayer,
    isInAppLayerOpen,
  } = useInAppApproach();

  const {
    openMarcLayer,
    closeMarcLayer,
    isMarcLayerOpen
  } = useMarcApproach();

  const {
    isBulkEditModalOpen,
    openManualModal,
    closeManualModal,
  } = useManualApproach();

  const { isOperationInPreviewStatus } = getBulkOperationStatsByStep(bulkDetails, step);
  const isLogsTab = criteria === CRITERIA.LOGS;
  const isQueryTab = criteria === CRITERIA.QUERY;
  const isIdentifierTab = criteria === CRITERIA.IDENTIFIER;
  const isQueryOrIdentifierCriteria = (isQueryTab && bulkDetails?.fqlQuery) || (isIdentifierTab && !bulkDetails?.fqlQuery);
  const isActionMenuVisible = isQueryOrIdentifierCriteria && isActionMenuShown && !isLogsTab && isOperationInPreviewStatus;

  const title = useMemo(() => {
    if (bulkDetails?.userFriendlyQuery) return <FormattedMessage id="ui-bulk-edit.preview.query.title" values={{ queryText: bulkDetails.userFriendlyQuery }} />;

    return <FormattedMessage id="ui-bulk-edit.preview.file.title" values={{ fileUploadedName: initialFileName }} />;
  }, [bulkDetails?.userFriendlyQuery, initialFileName]);

  const providerValue = {
    countOfRecords,
    setCountOfRecords,
    visibleColumns,
    setVisibleColumns,
    draftVisibleColumns,
    setDraftVisibleColumns,
    confirmedFileName,
    isFileUploaded,
    setIsFileUploaded,
    title,
  };

  useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_ACTION_MENU,
    enabled: !!fileInfo,
    id: bulkOperationId,
    fileContentType: FILE_SEARCH_PARAMS[fileInfo?.param],
    onSuccess: fileData => {
      savePreviewFile({
        fileData,
        fileName: fileInfo?.bulkDetails[FILE_KEYS[fileInfo?.param]],
      });
    },
    onSettled: () => {
      setFileInfo(null);
    },
  });

  useResetAppState({
    setConfirmedFileName,
    setCountOfRecords,
    setVisibleColumns,
    filtersTab,
    closeInAppLayer,
    closeMarcLayer,
  });

  const handleStartBulkEdit = useCallback((approach) => {
    if (approach === APPROACHES.IN_APP) {
      openInAppLayer();
    }

    if (approach === APPROACHES.MANUAL) {
      openManualModal();
    }

    if (approach === APPROACHES.MARC) {
      openMarcLayer();
    }
  }, [openInAppLayer, openManualModal, openMarcLayer]);

  const handleOpenProfilesModal = (approach) => {
    setProfileModalOpen(true);

    setParam('approach', approach);
  };

  const handleCloseProfilesModal = () => {
    setProfileModalOpen(false);
  };

  const renderActionMenu = ({ onToggle }) => isActionMenuVisible && (
    <BulkEditActionMenu
      onEdit={handleStartBulkEdit}
      onOpenProfiles={handleOpenProfilesModal}
      onToggle={onToggle}
      setFileInfo={setFileInfo}
    />
  );

  const renderApproaches = (paneProps) => (
    <TenantsProvider tenants={bulkOperationTenants || []} showLocal>
      {/* BULK-EDIT IDENTIFIERS AND QUERY */}
      {isInAppLayerOpen && (
      <BulkEditFolioLayer
        bulkOperationId={bulkOperationId}
        paneProps={paneProps}
        onInAppLayerClose={closeInAppLayer}
        isInAppLayerOpen={isInAppLayerOpen}
      />
      )}
      {isMarcLayerOpen && (
      <BulkEditMarcLayer
        bulkOperationId={bulkOperationId}
        paneProps={paneProps}
        onMarcLayerClose={closeMarcLayer}
        isMarcLayerOpen={isMarcLayerOpen}
      />
      )}

      {/* BULK-EDIT MANUAL UPLOAD CSV WITH CHANGES */}
      <BulkEditManualUploadModal
        operationId={bulkOperationId}
        open={isBulkEditModalOpen}
        onCancel={closeManualModal}
        countOfRecords={countOfRecords}
        setCountOfRecords={setCountOfRecords}
      />

      {/* BULK-EDIT USING PROFILES */}
      <BulkEditProfileFlow
        open={profileModalOpen}
        bulkOperationId={bulkOperationId}
        onClose={handleCloseProfilesModal}
        onOpen={handleOpenProfilesModal}
      />
    </TenantsProvider>
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
            {renderApproaches}
          </BulkEditIdentifiers>
        )}

        { isQueryTab && (
          <BulkEditQuery
            bulkDetails={bulkDetails}
            actionMenu={renderActionMenu}
          >
            {renderApproaches}
          </BulkEditQuery>
        )}

        { isLogsTab && <BulkEditLogs /> }
      </Paneset>

    </RootContext.Provider>
  );
};
