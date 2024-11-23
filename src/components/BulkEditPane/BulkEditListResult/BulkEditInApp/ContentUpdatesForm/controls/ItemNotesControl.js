import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Select } from '@folio/stripes/components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { FIELD_VALUE_KEY, getLabelByValue, sortWithoutPlaceholder } from '../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { useBulkOperationTenants, useItemNotes, useItemNotesEcs } from '../../../../../../hooks/api';
import { getItemNotes } from '../../../../../../constants';


export const ItemNotesControl = ({ bulkOperationId, option, actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);
  const { data: tenants } = useBulkOperationTenants(bulkOperationId);
  const { itemNotes, usItemNotesLoading } = useItemNotes();
  const { notesEcs: itemsNotes, isFetching: isItemsNotesEcsLoading } = useItemNotesEcs(tenants, 'action', { enabled: isCentralTenant });

  const notes = isCentralTenant ? removeDuplicatesByValue(itemsNotes, tenants) : itemNotes;
  const filteredAndMappedNotes = getItemNotes(formatMessage, notes)
    .filter(obj => obj.value !== option)
    .map(({ label, value, tenant }) => ({ label, value, tenant }));
  const sortedNotes = sortWithoutPlaceholder(filteredAndMappedNotes);
  const title = getLabelByValue(sortedNotes, actionValue);

  if (isItemsNotesEcsLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Select
        id="noteType"
        value={actionValue}
        disabled={usItemNotesLoading || isItemsNotesEcsLoading}
        onChange={e => onChange({
          actionIndex,
          value: e.target.value,
          fieldName: FIELD_VALUE_KEY,
          tenants: getTenantsById(sortedNotes, e.target.value),
        })}
        dataOptions={sortedNotes}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        marginBottom0
        dirty={!!actionValue}
      />
    </div>
  );
};

ItemNotesControl.propTypes = {
  bulkOperationId: PropTypes.string,
  option: PropTypes.string,
  actionValue: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
