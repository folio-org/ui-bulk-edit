import { useIntl } from 'react-intl';

import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import {
  CAPABILITIES,
  getHoldingsOptions,
  getInstanceOptions,
  getItemsOptions,
  getUserOptions
} from '../constants';
import {
  useHoldingsNotes,
  useHoldingsNotesEcs,
  useInstanceNotes,
  useItemNotes,
  useItemNotesEcs
} from './api';
import { filterOptionsByPermissions, removeDuplicatesByValue } from '../utils/helpers';
import { sortAlphabetically } from '../utils/sortAlphabetically';


export const useOptionsWithTenants = (recordType, tenants) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const isItemRecordType = recordType === CAPABILITIES.ITEM;
  const isHoldingsRecordType = recordType === CAPABILITIES.HOLDING;
  const isInstanceRecordType = recordType === CAPABILITIES.INSTANCE;

  const isCentralTenant = checkIfUserInCentralTenant(stripes);

  const { itemNotes, isItemNotesLoading } = useItemNotes({ enabled: isItemRecordType });
  const { notesEcs: itemNotesEcs, isFetching: isItemsNotesEcsLoading } = useItemNotesEcs(tenants, 'option', { enabled: isItemRecordType && isCentralTenant && tenants });

  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsRecordType });
  const { notesEcs: holdingsNotesEcs, isFetching: isHoldingsNotesEcsLoading } = useHoldingsNotesEcs(tenants, 'option', { enabled: isHoldingsRecordType && isCentralTenant && tenants });

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
  })[recordType];

  const areAllOptionsLoaded = optionsByType && !isItemNotesLoading && !isInstanceNotesLoading && !isItemsNotesEcsLoading && !isHoldingsNotesLoading && !isHoldingsNotesEcsLoading;
  const options = filterOptionsByPermissions(sortAlphabetically(optionsByType), stripes);

  return {
    options,
    areAllOptionsLoaded
  };
};
