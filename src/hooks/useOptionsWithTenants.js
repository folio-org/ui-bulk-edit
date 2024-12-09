import { useIntl } from 'react-intl';

import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { useSearchParams } from './useSearchParams';
import {
  CAPABILITIES,
  getHoldingsOptions,
  getInstanceOptions,
  getItemsOptions,
  getUserOptions
} from '../constants';
import {
  useBulkOperationTenants,
  useHoldingsNotes,
  useHoldingsNotesEcs,
  useInstanceNotes,
  useItemNotes,
  useItemNotesEcs
} from './api';
import { removeDuplicatesByValue } from '../utils/helpers';
import { sortAlphabetically } from '../utils/sortAlphabetically';


export const useOptionsWithTenants = (bulkOperationId) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const { currentRecordType } = useSearchParams();

  const isItemRecordType = currentRecordType === CAPABILITIES.ITEM;
  const isHoldingsRecordType = currentRecordType === CAPABILITIES.HOLDING;
  const isInstanceRecordType = currentRecordType === CAPABILITIES.INSTANCE;

  const { data: tenants, isLoading } = useBulkOperationTenants(bulkOperationId);

  const isCentralTenant = checkIfUserInCentralTenant(stripes);

  const { itemNotes, isItemNotesLoading } = useItemNotes({ enabled: isItemRecordType });
  const { notesEcs: itemNotesEcs, isFetching: isItemsNotesEcsLoading } = useItemNotesEcs(tenants, 'option', { enabled: isItemRecordType && isCentralTenant && !isLoading });

  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsRecordType });
  const { notesEcs: holdingsNotesEcs, isFetching: isHoldingsNotesEcsLoading } = useHoldingsNotesEcs(tenants, 'option', { enabled: isHoldingsRecordType && isCentralTenant && !isLoading });

  const { instanceNotes, isInstanceNotesLoading } = useInstanceNotes({ enabled: isInstanceRecordType });

  const itemsByTenant = isCentralTenant ? itemNotesEcs : itemNotes;
  const itemsWithoutDuplicates = removeDuplicatesByValue(itemsByTenant, tenants);

  const holdingsByTenant = isCentralTenant ? holdingsNotesEcs : holdingsNotes;
  const holdingsWithoutDuplicates = removeDuplicatesByValue(holdingsByTenant, tenants);

  const optionsByType = ({
    [CAPABILITIES.USER]: getUserOptions(formatMessage),
    [CAPABILITIES.ITEM]: getItemsOptions(formatMessage, itemsWithoutDuplicates),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(formatMessage, holdingsWithoutDuplicates),
    [CAPABILITIES.INSTANCE]: getInstanceOptions(formatMessage, instanceNotes),
  })[currentRecordType];

  const areAllOptionsLoaded = optionsByType && !isItemNotesLoading && !isInstanceNotesLoading && !isItemsNotesEcsLoading && !isHoldingsNotesLoading && !isHoldingsNotesEcsLoading;
  const options = sortAlphabetically(optionsByType);

  return {
    options,
    areAllOptionsLoaded
  };
};
