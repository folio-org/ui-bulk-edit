import { useStripes } from '@folio/stripes/core';

import { useBulkPermissions, useSearchParams } from '../../hooks';
import {
  CAPABILITIES,
  CRITERIA,
  EDITING_STEPS,
  JOB_STATUSES,
  OPERATION_TYPES,
  getDownloadLinks,
} from '../../constants';
import { getBulkOperationStatsByStep } from '../BulkEditPane/BulkEditListResult/PreviewLayout/helpers';

const START_ACTION_STATUSES = [
  JOB_STATUSES.DATA_MODIFICATION,
  JOB_STATUSES.REVIEW_CHANGES,
  JOB_STATUSES.REVIEWED_NO_MARC_RECORDS,
];

/**
 * Computes which sections the bulk edit Action menu would render for the current
 * bulk operation.
 *
 * It returns both the granular flags used to render the start/delete actions and
 * an aggregate `hasAnyContent` flag, so callers can hide the Actions button
 * entirely when the menu would otherwise be empty (no links, no start actions,
 * no columns).
 */
export const useActionMenuContent = ({ bulkDetails, visibleColumns }) => {
  const stripes = useStripes();
  const perms = useBulkPermissions();
  const { step, currentRecordType, criteria } = useSearchParams();

  const {
    hasUserEditLocalPerm,
    hasHoldingsInventoryEdit,
    hasItemInventoryEdit,
    hasUserEditInAppPerm,
    hasUserDeleteInAppPerm,
    hasInstanceInventoryEdit,
    hasInstanceAndMarcEditPerm,
    hasInventoryAndMarcEditPerm,
  } = perms;

  const { countOfRecords } = getBulkOperationStatsByStep(bulkDetails, step);

  const hasEditPerm = (hasHoldingsInventoryEdit && currentRecordType === CAPABILITIES.HOLDING)
      || (hasItemInventoryEdit && currentRecordType === CAPABILITIES.ITEM)
      || (hasUserEditInAppPerm && currentRecordType === CAPABILITIES.USER)
      || (hasInstanceInventoryEdit && currentRecordType === CAPABILITIES.INSTANCE);

  const isECS = stripes.user?.user?.consortium;
  const isStartBulkCsvActive = hasUserEditLocalPerm && currentRecordType === CAPABILITIES.USER;
  const isInitialStep = step === EDITING_STEPS.UPLOAD;
  const isStatusActive = START_ACTION_STATUSES.includes(bulkDetails?.status);

  const isStartBulkInAppActive = hasEditPerm && isInitialStep && isStatusActive;
  const isStartMarcActive = (isStartBulkInAppActive || hasInstanceAndMarcEditPerm || hasInventoryAndMarcEditPerm)
    && currentRecordType === CAPABILITIES.INSTANCE
    && isInitialStep
    && isStatusActive;
  const isStartBulkDeleteActive = hasUserDeleteInAppPerm
    && currentRecordType === CAPABILITIES.USER
    && isInitialStep
    && isStatusActive;
  const isStartManualButtonVisible = isStartBulkCsvActive
    && isInitialStep
    && countOfRecords > 0
    && criteria !== CRITERIA.QUERY
    && !isECS;

  const hasStartButtons = isStartBulkInAppActive
    || isStartMarcActive
    || isStartManualButtonVisible
    || isStartBulkDeleteActive;

  const hasLinks = getDownloadLinks({ perms, step })
    .some(link => bulkDetails && Object.hasOwn(bulkDetails, link.KEY) && link.IS_VISIBLE);

  // A delete operation has no preview, so any cached columns left over from the
  // matching step (RootContext state survives the in-app redirect) must not count.
  const hasColumns = bulkDetails?.operationType !== OPERATION_TYPES.DELETE
    && (visibleColumns?.length ?? 0) > 0;

  const hasAnyContent = hasLinks || hasStartButtons || hasColumns;

  return {
    isStartBulkInAppActive,
    isStartMarcActive,
    isStartBulkDeleteActive,
    isStartManualButtonVisible,
    hasLinks,
    hasStartButtons,
    hasColumns,
    hasAnyContent,
  };
};
